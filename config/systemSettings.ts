export default {
  trello: {
    apiKey: process.env.NEXT_PUBLIC_TRELLO_API_KEY,
    // eslint-disable-next-line max-len
    authURL: `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=fragment&name=Sparkle&key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}`
  },
  slack: {
    apiKey: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
    // eslint-disable-next-line max-len
    authURL: `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=incoming-webhook,chat:write&user_scope=channels:write`
  }
};
