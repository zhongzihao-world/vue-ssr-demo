/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp } from './main';

export default (context: any) =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp();
    router.push(context.url);
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({
          code: 404,
        });
      }
      resolve(app);
    }, reject);
  });
