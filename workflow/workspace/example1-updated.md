### Workflow Summary
This workflow diagram demonstrates an automated task sequence for coffee brewing with decision and merge nodes to handle different conditions and paths.

### Documentation
- **Push**: The push task is performed by the user. He or she pushes the button.
- **ChkWt**: An automated task that checks the weight.
- **ChkTp**: An automated task that checks the temperature.
- **WtOK**: An automated task that confirms the weight is okay.
- **RflWt**: A manual task to recheck the weight.
- **KeepTp**: An automated task to maintain the temperature.
- **PreHeat**: An automated task to preheat.
- **Brew**: An automated task for brewing.
- **Fork Node**: Divides the flow into parallel checks for weight and temperature.
- **Decision Node (Weight Check)**: Decides the path based on the weight check results.
- **Decision Node (Temperature Check)**: Decides the path based on the temperature check results.
- **Merge Node**: Merges the different paths into one after checks.
- **Join Node**: Joins parallel tasks back into a single flow.