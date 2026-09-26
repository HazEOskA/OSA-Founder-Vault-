export type ClaimPolicyInput = {
  status: string;
  tokenConsumed: boolean;
  tokenExpired: boolean;
  hasOwner: boolean;
};

export class ClaimRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimRejectedError";
  }
}

export function assertClaimable(input: ClaimPolicyInput) {
  if (input.status !== "CLAIMABLE") {
    throw new ClaimRejectedError("Pass is not claimable");
  }
  if (input.hasOwner) {
    throw new ClaimRejectedError("Pass already has an owner");
  }
  if (input.tokenConsumed) {
    throw new ClaimRejectedError("Claim token has already been used");
  }
  if (input.tokenExpired) {
    throw new ClaimRejectedError("Claim token has expired");
  }
}
