# Care

Web application for logging medical events for my dad.

## Event

Examples:

- Gave 5 mg of morphine, or 2 mg of lorazepam
- Feeling nauseous, or had diarrhea, or vomited, or constipated, or good stool
- Ate a popsicle, or ate toast

I guess I want to track when medications are given, when symptoms are felt, and when food is eaten.

Each event has a timestamp, a type (medication, symptom, food), and a description.

## Architecture

As a first attempt, I'll use:

- SvelteKit for the frontend
- FaunaDB for the database
- Vercel for hosting

### Authetication

We need to authenticate to use the Fauna DB, where the events are stored. Additionally, I want auth
to be stupidly simple: just a password. This is a toy project used by me and by non-tech healthcare
people that I don't want to bother with full-fledged auth.

The password will be hashed with SHA-256, and that will be the key that AES-decrypts FaunaDB key.
Then, that FaunaDB key will be passed along with FaunaDB queries.

So,

```text
fauna_db_key = AES-decrypt(key=SHA-256(password), ciphertext=encrypted_fauna_db_key)
```

I know this is not secure, but it's good enough for now. Anything more would require more external
dependencies (identity providers, servers, etc.)

(The public key will be served statically in the app, and used to verify the JWTs.)
