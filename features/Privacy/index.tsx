import { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

/*
 * Sparkle's privacy policy.
 *
 * Google's OAuth consent screen links here, and will not publish without it,
 * so this page must stay reachable without signing in -- see the isPrivacyPage
 * exemption in common/Auth/PrivateRoute.
 *
 * The Google Sign-In section below describes what the code ACTUALLY does. The
 * scopes come from Firebase's GoogleAuthProvider defaults (email, profile,
 * openid) and the stored fields are the ones in the users collection written by
 * POST /v0/users. If either changes, change this page in the same commit.
 */

const LAST_UPDATED = 'August 28, 2026';

const Privacy: FunctionComponent = () => (
  <div className={styles.page}>
    <article className={styles.privacy} data-testid="privacy-policy">
      <header className={styles.privacy__masthead}>
        <h1>Sparkle Privacy Policy</h1>
        <p className={styles.privacy__updated}>Effective {LAST_UPDATED}</p>
      </header>

      <p>
        Sparkle is a private property inspection application operated by
        Bluecore Residential, used by our staff on the web and on iPhone and
        iPad. It is not a consumer product, it is not open to public sign up,
        and it is not available to the general public.
      </p>

      <h2>Signing in with Google</h2>

      <p>
        Sparkle uses Google to sign you in. Signing in with Google is the
        primary way into Sparkle on both the web application and the iOS app. An
        email address and password remains available as an alternative.
      </p>

      <h3>What we ask Google for</h3>

      <p>
        We request only your basic profile and email address. We do not request
        access to Gmail, Drive, Calendar, Contacts, Photos, or any other Google
        service, and we cannot read them.
      </p>

      <h3>What Google sends us, and what we keep</h3>

      <div className={styles.privacy__tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Sent by Google</th>
              <th>Do we store it?</th>
              <th>What it is used for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email address</td>
              <td>Yes</td>
              <td>Identifies which Sparkle account you are signing in to</td>
            </tr>
            <tr>
              <td>Whether that address is verified</td>
              <td>No</td>
              <td>Checked at sign in, then discarded</td>
            </tr>
            <tr>
              <td>Google account identifier</td>
              <td>Yes</td>
              <td>
                Links your Google identity to your existing Sparkle account
              </td>
            </tr>
            <tr>
              <td>First and last name</td>
              <td>Yes</td>
              <td>Shown on inspections and other work you record</td>
            </tr>
            <tr>
              <td>Profile picture</td>
              <td>No</td>
              <td>Not requested and not displayed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className={`${styles.privacy__callout} ${styles['privacy__callout--affirm']}`}
      >
        <p>
          <strong>
            We do not store Google access tokens or refresh tokens.
          </strong>{' '}
          Sparkle has no standing access to your Google account and cannot read
          anything from it between sign ins.
        </p>
      </div>

      <div className={styles.privacy__callout}>
        <p>
          <strong>Signing in with Google never creates an account.</strong> If
          the Google address you use does not already match a Sparkle account,
          you are refused and told to contact an administrator. Google sign in
          opens a door you already have a key to. It is not a way in.
        </p>
      </div>

      <p>
        Sparkle&apos;s use of information received from Google APIs adheres to
        the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h3>Disconnecting Google</h3>

      <p>
        Ask your Sparkle administrator to unlink Google from your account. You
        can also revoke Sparkle&apos;s access at any time from your{' '}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noreferrer"
        >
          Google account permissions
        </a>
        .
      </p>

      <h2>Other information Sparkle holds</h2>

      <ul>
        <li>
          <strong>Account details</strong> — your name, work email address, and
          the properties and teams an administrator has given you access to.
        </li>
        <li>
          <strong>Work you record</strong> — inspections, deficient items, job
          and bid records, notes, and the photos you take, along with who
          recorded them and when.
        </li>
        <li>
          <strong>Device information</strong> — if you use the iOS app and leave
          notifications enabled, a push notification token for your device.
        </li>
        <li>
          <strong>A password</strong> — stored by Google Firebase as a hash, and
          only if you use the email and password sign in option.
        </li>
      </ul>

      <p>
        Sparkle sets a session cookie so that you stay signed in. There are no
        advertising cookies, no analytics cookies, and no third party tracking
        of any kind.
      </p>

      <h2>Who else sees it</h2>

      <p>
        Other Sparkle users at Bluecore Residential, according to the property
        and team access an administrator has granted them. Our infrastructure
        providers process this data on our behalf: Google Firebase hosts the
        application, its database, and authentication; Amazon Web Services
        stores inspection photos. Some inspection activity is posted to our
        internal Slack workspace and, where a property is configured for it, to
        Trello.
      </p>

      <p>
        We do not sell this information, we do not use it for advertising, and
        we do not share it with anyone else.
      </p>

      <h2>How long we keep it</h2>

      <p>
        Inspection records are kept as part of our business records for as long
        as we need them. When someone leaves, an administrator deactivates their
        account; the work they recorded stays, because it is a record of what
        was inspected and when.
      </p>

      <h2>Security</h2>

      <p>
        Access requires an account created by an administrator. Data is
        encrypted in transit, and our database rules refuse access to anyone
        without a Sparkle user record.
      </p>

      <h2>Changes to this policy</h2>

      <p>If this policy changes, the effective date above changes with it.</p>

      <h2>Contact</h2>

      <p>
        Because access to Sparkle is by invitation only, questions about this
        policy or about the information Sparkle holds are best raised with your
        Sparkle administrator. More about our company is at{' '}
        <a
          href="https://www.bluecoreresidential.com"
          target="_blank"
          rel="noreferrer"
        >
          bluecoreresidential.com
        </a>
        .
      </p>

      <footer className={styles.privacy__footer}>
        <p>
          Sparkle is an internal application of Bluecore Residential and is not
          available to the general public.
        </p>
        <Link href="/login">&larr; Back to sign in</Link>
      </footer>
    </article>
  </div>
);

export default Privacy;
