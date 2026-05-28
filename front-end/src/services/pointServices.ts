import api from "../lib/api";

/////////////////////////////////////////////////////
// GET MY POINTS
/////////////////////////////////////////////////////

export async function getMyPoints() {
  const response = await api.get(
    "/points/me"
  );

  return response.data.data;
}

/////////////////////////////////////////////////////
// CLAIM / RETURN POINTS
/////////////////////////////////////////////////////

export async function returnPoints(
  points: number
) {
  const response = await api.post(
    "/points/return",
    {
      points,
    }
  );

  return response.data;
}

/////////////////////////////////////////////////////
// GIVE REFERRAL POINTS
/////////////////////////////////////////////////////

export async function giveReferralPoints(
  referralCode: string
) {
  const response = await api.post(
    "/points/referral",
    {
      referralCode,
    }
  );

  return response.data;
}