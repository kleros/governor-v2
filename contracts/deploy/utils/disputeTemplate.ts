// WARNING: Naive implementation, answers would be dynamic based on how many lists there are in the session.
export const templateFn = (arbitratorAddress: string, arbitrableChainID: number) => `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Execute a transaction list in Kleros Governor",
  "description": "Multiple transaction lists were submitted in Kleros Governor session {{externalDisputeID}}, please vote for which list transaction list should be executed.",
  "question": "Which transaction list should be executed?",
   "answers": [
      {{#listIds}}
      {
          "id": "{{#hex}}{{.}}{{/hex}}",
          "title": "List - {{ . }}",
          "description": "Execute List {{ . }}"
          
      },
      {{/ listIds }}
      {
        "id":"0x00",
        "title": "Refuse to Arbitrate",
        "description": "No list will be executed."
      }

    ],
  "policyURI": "/ipfs/QmPt2oTHCYZYUShuLxiK4QWH6sXPHjvgXTqMDpCShKogQY/KlerosGovernorPrimaryDocument.pdf",
  "frontendUrl": "https://governor-v2.kleros.builders/governor/{{arbitrable}}",
  "arbitratorChainID": "${arbitrableChainID}",
  "arbitratorAddress": "${arbitratorAddress}",
  "category": "Kleros Governor",
  "version": "1.0"
}
`;

export const dataMappings = `
[
  {
    "type": "abi/call",
    "abi": "function getSession(uint256) view returns ((uint256 , uint256 , uint256[] , uint256 , uint8 , uint256 ))",
    "address": "{{{arbitrableAddress}}}",
    "functionName": "getSession",
    "args": [
      "{{{externalDisputeID}}}"
    ],
    "seek": [
    "2"
    ],
    "populate": [
      "listIds"
    ]
  }
]
`;
