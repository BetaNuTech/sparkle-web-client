import { FunctionComponent } from 'react';
import Link from 'next/link';
import PublicPage from '../../common/PublicPage';

/*
 * Sparkle's public home page.
 *
 * This is the URL configured as "App home page" on the Google OAuth consent
 * screen, and Google's brand verification loads it as an anonymous visitor. It
 * must therefore stay reachable without signing in (see the public route list
 * in common/Auth/PrivateRoute), must describe what the application actually
 * does, and must link to the privacy policy at the same URL configured on the
 * consent screen.
 *
 * A first attempt pointed the consent screen at "/", which redirects anonymous
 * visitors to /login. Verification was refused: "Your home page is behind a
 * login page" and "Your home page does not explain the purpose of your app."
 */

const About: FunctionComponent = () => (
  <PublicPage
    title="Sparkle"
    subtitle="Property inspections for Bluecore Residential"
    testId="about-page"
    footer={
      <>
        <p>
          Sparkle is an internal application of Bluecore Residential and is not
          available to the general public.
        </p>
        <p>
          <Link href="/privacy">Privacy policy</Link>
          {' · '}
          <Link href="/login">Sign in</Link>
        </p>
      </>
    }
  >
    <p>
      Sparkle is the property inspection application used by staff at Bluecore
      Residential. Inspectors use it on iPhone and iPad while walking a
      property, and on the web from the office, to record the condition of the
      homes and communities the company manages.
    </p>

    <h2>What it does</h2>

    <ul>
      <li>
        <strong>Inspections.</strong> Staff complete inspections against
        templates configured for each property, recording scores, written notes
        and photographs as they go, and generating a report at the end.
      </li>
      <li>
        <strong>Deficient items.</strong> Anything found in an inspection that
        needs attention is tracked from the moment it is raised, through a plan
        to fix it and a due date, until it is completed and verified.
      </li>
      <li>
        <strong>Jobs and bids.</strong> Larger work is recorded as a job, with
        bids from vendors attached, so the cost and progress of repairs stay
        alongside the inspection that prompted them.
      </li>
      <li>
        <strong>Properties and teams.</strong> Administrators decide which
        properties and teams each member of staff can see, so people work with
        the communities they are responsible for.
      </li>
    </ul>

    <h2>Who can use it</h2>

    <p>
      Sparkle is invitation only. There is no public sign up, and creating an
      account is not something a visitor can do. An administrator at Bluecore
      Residential adds each person before they can sign in.
    </p>

    <h2>Signing in</h2>

    <p>
      Signing in uses your Google account for your work email address, on the
      web and in the iOS app. Choosing &ldquo;Sign in with Google&rdquo; when
      your address has no Sparkle account does not create one &mdash; you are
      told to contact an administrator instead. Signing in with an email address
      and password remains available as an alternative.
    </p>

    <p>
      The <Link href="/privacy">privacy policy</Link> describes exactly what
      Google shares with Sparkle when you sign in, and which of it we store.
    </p>
  </PublicPage>
);

export default About;
