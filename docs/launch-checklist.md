# Launch Checklist

Use this checklist before deploying the Resume Builder MVP to a public or semi-public environment.

## Environment

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set for production.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set for production.
- [ ] `DEEPSEEK_API_KEY` or the configured AI provider key is set server-side only.
- [ ] `.env.local` is not committed or uploaded to the deployment target.
- [ ] Production domain is configured in Supabase Auth redirect URLs.
- [ ] `/auth/callback` works on the production domain.

## Supabase

- [ ] `resumes` table exists.
- [ ] Row Level Security is enabled on `resumes`.
- [ ] Users can only select their own resumes.
- [ ] Users can only insert resumes for their own `user_id`.
- [ ] Users can only update their own resumes.

## AI Protection

- [ ] `/api/ai/polish` requires authentication.
- [ ] `/api/ai/polish` checks resume ownership before calling the AI provider.
- [ ] Basic in-memory rate limiting is enabled.
- [ ] Technical debt noted: in-memory rate limiting is only suitable for local development and small-scale internal testing. It is not a production-grade global quota or abuse-prevention system.
- [ ] Before a larger launch, replace in-memory rate limiting with Redis, Upstash, a database-backed quota system, or another production-grade rate limiter.

## Legal And Trust

- [ ] `/privacy` is reachable.
- [ ] `/privacy` mentions that AI polish text may be sent to a third-party AI provider.
- [ ] `/privacy` does not promise resume deletion before the product supports it.
- [ ] `/terms` is reachable.
- [ ] `/terms` states that AI output is for reference only.
- [ ] `/terms` states that the service does not guarantee job-search outcomes.

## Quality Gates

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] New-user registration smoke test passes.
- [ ] Login smoke test passes.
- [ ] Create resume smoke test passes.
- [ ] Edit and save resume smoke test passes.
- [ ] Export PDF smoke test passes after editing unsaved content.
- [ ] Summary AI polish smoke test passes.
- [ ] Deleting experience and education entries shows a confirmation prompt.

## Deployment Smoke Test

- [ ] Visit `/`.
- [ ] Visit `/privacy`.
- [ ] Visit `/terms`.
- [ ] Register or log in.
- [ ] Create a resume.
- [ ] Edit unsaved content and click export PDF.
- [ ] Confirm the print page shows the latest edited content.
- [ ] Confirm another account cannot access the resume URL.
