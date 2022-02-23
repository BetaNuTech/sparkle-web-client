# User & Team Permissions

Sparkle users can be assigned different levels of access depending on their role within the company.

## Permissions Levels

- Admin: (`admin: true`) access to everything.
- Corporate: (`corporate: true`) access to most things.
- Property Level: (`properties: { <property-id>: true }` access to specific properties.
- No access: usually new users that haven't been assigned any access by admins.

### Teams

- Allow assigning groups of property permissions to a user.
- Properties can belong to one team.
- Users can belong to multiple teams.
- User's `properties` relationships is complex and therefore managed by backend API.

### Team Leads

- More of a term used than a specific permissions level.
- In practice Team leads are corporate level users that are also members of teams.
