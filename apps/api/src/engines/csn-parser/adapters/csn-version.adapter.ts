import { CsnRoot } from '../../../domain/metadata/models/csn.types';

export interface CsnVersionAdapter {
  normalize(root: CsnRoot): CsnRoot;
}

export class DefaultCsnVersionAdapter implements CsnVersionAdapter {
  normalize(root: CsnRoot): CsnRoot {
    return root;
  }
}
