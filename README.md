Status Codes
------------

==Success Codes==
200 - General success

201 - Created

==Error Codes==
403 - Unauthorized

404 - User not found on parse

427 - Object ID not included when searching for leagues created by the user

428 - Validation failed

429 - User must be an admin

512 - Populating a new user with default data - but the user passed in the route could not be found on Parse

513 - Error adding default data to new Parse user

514 - Attempted to set default values on a user that isn't a new user

515 - Name was not included when creating a new league

516 - Error saving new league to parse

517 - When creating a new league the request tried to add a new rule instead of just modifying one

518 - User cannot join league, not enough open spaces

519 - User cannot join league, already joined

520 - User not authenticated