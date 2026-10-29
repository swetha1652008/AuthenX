import https from 'https';

/**
 * Validates document text against registered application metadata using Gemini API (if key is configured)
 * Never stores or returns fake AI findings or fabricated confidence scores.
 */
export async function validateWithGeminiAI({ text, filename, category, registeredApp }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return {
      configured: false,
      aiModel: 'None (GEMINI_API_KEY not configured)',
      status: 'API_KEY_REQUIRED',
      message: 'GEMINI_API_KEY environment variable is not configured on the server. To enable genuine neural AI validation, set GEMINI_API_KEY in your server environment.',
      findings: [],
      rawResponse: null,
    };
  }

  // Construct structured prompt for Gemini
  const prompt = `You are the AI Document Authentication Engine for the All India Council for Technical Education (AICTE).
Analyze the extracted document text for statutory compliance with the AICTE Approval Process Handbook (APH 2026-27).

DOCUMENT METADATA:
- Uploaded Filename: "${filename}"
- Category: "${category}"

REGISTERED APPLICATION DETAILS:
- Registered Institution Name: "${registeredApp?.institution?.name || 'Unknown'}"
- Registered AICTE Permanent Institute ID (PID): "${registeredApp?.institution?.aictePermanentId || registeredApp?.institutionId || 'Unknown'}"
- Reference Number: "${registeredApp?.referenceNumber || 'Unknown'}"

EXTRACTED DOCUMENT TEXT:
"""
${text.slice(0, 4000)}
"""

INSTRUCTIONS:
1. Extract candidate attributes: institutionName, permanentId, documentNumber, issueDate, expiryDate, issuingAuthority, signatory.
2. Compare extracted attributes against the registered application details.
3. Check for:
   - AICTE Permanent Institute ID (PID) cross-match
   - Institutional legal entity name match
   - Expiry date validity (evaluation baseline: 2026-10-29)
   - Chronological sequence (issueDate must precede expiryDate)
   - Evidence of editing or raster graphic manipulation markers
4. Return ONLY valid JSON with this exact schema:
{
  "extractedFields": {
    "institutionName": "string or null",
    "permanentId": "string or null",
    "documentNumber": "string or null",
    "issueDate": "string or null",
    "expiryDate": "string or null",
    "issuingAuthority": "string or null",
    "signatory": "string or null"
  },
  "isConsistent": boolean,
  "confidenceScore": number (between 0.50 and 0.98 based strictly on text clarity and completeness, never hardcoded),
  "findings": [
    {
      "type": "Data Mismatch" | "Expiry Issue" | "Potential Duplicate" | "Manual Review Required" | "No Issue Detected by Implemented Checks",
      "severity": "CRITICAL" | "WARNING" | "INFO",
      "explanation": "clear factual statement",
      "evidence": "exact quote or compared values",
      "recommendedAction": "clear statutory next step"
    }
  ],
  "reasoningSummary": "concise explanation of validation verdict"
}`;

  return new Promise((resolve) => {
    const payload = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 12000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve({
            configured: true,
            success: false,
            status: 'AI_SERVICE_ERROR',
            httpStatus: res.statusCode,
            message: `Gemini API returned HTTP status ${res.statusCode}: ${data.slice(0, 200)}`,
            findings: []
          });
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const candidateText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!candidateText) {
            resolve({
              configured: true,
              success: false,
              status: 'EMPTY_AI_RESPONSE',
              message: 'Gemini API returned no text candidate.',
              findings: []
            });
            return;
          }

          const structured = JSON.parse(candidateText);
          resolve({
            configured: true,
            success: true,
            aiModel: 'gemini-2.5-flash',
            status: 'COMPLETED',
            ...structured
          });
        } catch (err) {
          resolve({
            configured: true,
            success: false,
            status: 'SCHEMA_PARSE_ERROR',
            message: `Failed to parse structured response from Gemini: ${err.message}`,
            findings: []
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        configured: true,
        success: false,
        status: 'NETWORK_ERROR',
        message: `Failed to connect to Gemini API: ${err.message}`,
        findings: []
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        configured: true,
        success: false,
        status: 'TIMEOUT',
        message: 'Gemini API request timed out after 12 seconds.',
        findings: []
      });
    });

    req.write(payload);
    req.end();
  });
}
