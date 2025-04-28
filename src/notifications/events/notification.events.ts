export class GameInviteEvent {
  constructor(
    public readonly invitedUserId: string,
    public readonly inviterUsername: string,
    public readonly gameId: string,
  ) {}
}

export class GameWonEvent {
  constructor(
    public readonly winnerId: string,
    public readonly loserId: string,
    public readonly gameId: string,
  ) {}
}

export class MilestoneEvent {
  constructor(
    public readonly userId: string,
    public readonly milestoneType: string,
    public readonly milestoneValue: string,
  ) {}
}
