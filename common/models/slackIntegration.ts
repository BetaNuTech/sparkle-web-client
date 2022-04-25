interface SlackIntegration {
  grantedBy: string; // User Identifier
  team: string; // Slack team Identifier
  teamName: string; // Slack team name
  defaultChannelName?: string;
  createdAt: number;
}
export default SlackIntegration;
