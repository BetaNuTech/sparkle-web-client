export default {
  trello: {
    apiKey: process.env.NEXT_PUBLIC_TRELLO_API_KEY,
    // eslint-disable-next-line max-len
    authURL: `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=fragment&name=Sparkle&key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}`
  }
};
