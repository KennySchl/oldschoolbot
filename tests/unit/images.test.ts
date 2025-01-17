import { writeFile } from 'fs/promises';
import { Bank, Monsters } from 'oldschooljs';
import { toKMB } from 'oldschooljs/dist/util';
import { describe, test } from 'vitest';

import { drawChestLootImage } from '../../src/lib/bankImage';
import { clImageGenerator } from '../../src/lib/collectionLogTask';
import { pohImageGenerator } from '../../src/lib/pohImage';
import { pieChart } from '../../src/lib/util/chart';
import { mahojiChatHead } from '../../src/lib/util/chatHeadImage';
import { makeBankImage } from '../../src/lib/util/makeBankImage';
import { mockMUser } from './utils';

describe('Images', () => {
	test('Chat Heads', async () => {
		const result = await mahojiChatHead({
			content:
				'Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test',
			head: 'santa'
		});
		await writeFile('./tests/unit/snapshots/chatheads_santa.png', result.files[0].attachment);
	});

	test('Collection Log', async () => {
		const result: any = await clImageGenerator.generateLogImage({
			user: mockMUser({ cl: new Bank().add('Elysian sigil') }),
			collection: 'corp',
			type: 'collection',
			flags: {},
			stats: {
				sacrificedBank: new Bank(),
				titheFarmsCompleted: 1,
				lapsScores: {},
				openableScores: new Bank(),
				kcBank: {},
				highGambles: 1,
				gotrRiftSearches: 1
			}
		});
		await writeFile('./tests/unit/snapshots/cl_corp.png', result.files[0].attachment);
	});

	test('Bank Image', async () => {
		let bank = new Bank();
		for (const item of [...Monsters.Man.allItems, ...Monsters.Cow.allItems]) {
			bank.add(item);
		}
		bank.add('Twisted bow', 10_000_000);
		bank.add('Elysian sigil', 1_000_000);
		const res = await makeBankImage({
			bank,
			title: 'Test Image'
		});
		await writeFile('./tests/unit/snapshots/bank_1.png', res.file.attachment);
	});

	test('POH Image', async () => {
		const result = await pohImageGenerator.run({
			prayer_altar: 13_197,
			throne: 13_667,
			torch: 13_342,
			mounted_cape: 29_210,
			background_id: 1
		} as any);
		await writeFile('./tests/unit/snapshots/poh_1.png', result);
	});

	test('Chart Image', async () => {
		const result = await pieChart('Test', val => `${toKMB(val)}%`, [
			['Complete Collection Log Items', 20, '#9fdfb2'],
			['Incomplete Collection Log Items', 80, '#df9f9f']
		]);
		await writeFile('./tests/unit/snapshots/chart_1.png', result);
	});

	test('TOA Image', async () => {
		const image = await drawChestLootImage({
			entries: [
				{
					loot: new Bank()
						.add('Twisted bow')
						.add('Coal')
						.add('Egg')
						.add('Elysian sigil')
						.add('Trout')
						.add('Salmon'),
					user: mockMUser() as any,
					previousCL: new Bank().add('Twisted bow').add('Coal'),
					customTexts: []
				}
			],
			type: 'Tombs of Amascut'
		});
		await writeFile('./tests/unit/snapshots/toa_1.png', image.attachment as Buffer);
	});

	test('COX Image', async () => {
		const image = await drawChestLootImage({
			entries: [
				{
					loot: new Bank()
						.add('Twisted bow')
						.add('Coal')
						.add('Egg')
						.add('Elysian sigil')
						.add('Trout')
						.add('Salmon'),
					user: mockMUser() as any,
					previousCL: new Bank().add('Twisted bow').add('Coal'),
					customTexts: []
				}
			],
			type: 'Chambers of Xerician'
		});
		await writeFile('./tests/unit/snapshots/cox_1.png', image.attachment as Buffer);
	});
});
