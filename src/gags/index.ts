import type { FC } from 'react';
import type { GagId } from '../select.js';
import { BackwardsInstall } from './BackwardsInstall.js';
import { CaludeCode } from './CaludeCode.js';
import { DidYouMean } from './DidYouMean.js';
import { Disco } from './Disco.js';
import { Jackpot } from './Jackpot.js';
import { Shutdown } from './Shutdown.js';
import { SpellingBee } from './SpellingBee.js';
import type { GagProps } from './types.js';

export const GAGS: Record<GagId, FC<GagProps>> = {
  disco: Disco,
  shutdown: Shutdown,
  spellingBee: SpellingBee,
  caludeCode: CaludeCode,
  install: BackwardsInstall,
  didYouMean: DidYouMean,
  jackpot: Jackpot,
};
