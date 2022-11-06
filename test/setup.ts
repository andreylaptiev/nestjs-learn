import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  // remove test.sqlite before each test
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    // do not handle error if test.sqlite does not exist
  }
});
