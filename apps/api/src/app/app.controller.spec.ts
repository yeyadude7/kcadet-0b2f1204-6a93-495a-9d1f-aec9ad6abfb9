import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule (unit-ish)', () => {
  it('compiles the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
