import { Time } from 'e';

import { prisma } from '../../../lib/settings/prisma';
import { ActivityTaskOptions } from '../../../lib/types/minions';
import { randomVariation } from '../../../lib/util';
import addSubTaskToActivityTask from '../../../lib/util/addSubTaskToActivityTask';

export async function strongHoldOfSecurityCommand(user: MUser, channelID: string) {
	if (user.minionIsBusy) {
		return 'Your minion is busy.';
	}
	const count = await prisma.activity.count({
		where: {
			user_id: BigInt(user.id),
			type: 'StrongholdOfSecurity'
		}
	});
	if (count !== 0) {
		return "You've already completed the Stronghold of Security!";
	}

	await addSubTaskToActivityTask<ActivityTaskOptions>({
		userID: user.id,
		channelID: channelID.toString(),
		duration: randomVariation(Time.Minute * 10, 5),
		type: 'StrongholdOfSecurity'
	});

	return `${user.minionName} is now doing the Stronghold of Security!`;
}
