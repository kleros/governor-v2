// WARNING: Naive implementation, answers would be dynamic based on how many lists there are in the session.
export const templateFn = (arbitratorAddress: string, arbitrableChainID: number) => `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Execute a transaction list in Kleros Governor",
  "description": "Multiple transaction lists were submitted in a Kleros Governor session.",
  "question": "Which transaction list should executed?",
  "answers": [
    {
      "id":"0x1",
      "title": "Execute list 1",
      "description": "Select this if you think that the list 1 should be executed."
    },
    {
      "id":"0x2",
      "title": "Execute list 2",
      "description": "Select this if you think that the list 2 should be executed."
    }
  ], 
  "policyURI": "/ipfs/QmPt2oTHCYZYUShuLxiK4QWH6sXPHjvgXTqMDpCShKogQY/KlerosGovernorPrimaryDocument.pdf",
  "frontendUrl": "https://governor-v2.kleros.builders/",
  "arbitratorChainID": "${arbitrableChainID}",
  "arbitratorAddress": "${arbitratorAddress}",
  "category": "Kleros Governor",
  "version": "1.0"
}
`;
