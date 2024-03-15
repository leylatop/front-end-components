// import puppeteer from 'puppeteer';

// const tryRequire = (name = "") => {
//   try {
//     return eval("require")(name);
//   } catch (error) {}
// };

// export const SnapShot = () => {
//   const handleClick = async () => {
//     // const puppeteer = tryRequire('puppeteer')
//     const browser = await puppeteer.launch({
//       defaultViewport: {
//         width: 1920,
//         height: 1080,
//       },
//     });
//       const page = await browser.newPage();
//       await page.goto('https://modao.cc', {
//         waitUntil: 'documentloaded'
//       });
//       await page.screenshot({ type: 'png', path: 'example.png',  });

//       await browser.close();
//     // (async () => {
//     //   const browser = await puppeteer.launch();
//     //   const page = await browser.newPage();
//     //   await page.goto('https://www.baidu.com');
//     //   await page.screenshot({ path: 'example.png' });

//     //   await browser.close();
//     // })();
//   }
//   return (
//     <button onClick={handleClick}>截图</button>
//   )
// }

