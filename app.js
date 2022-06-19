const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const dir = process.env.OUT_DIR || __dirname;

// searchterm ex. lego+star+wars
const searchTerm = "lego";

const URL = `https://www.finn.no/bap/forsale/search.html?abTestKey=controlsuggestions&q=${searchTerm}&sort=PUBLISHED_DESC`;

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);

  const getAnnonser = await page.evaluate(() => {
    const annonser = document.querySelectorAll(
      "#page-results > div.ads.ads--liquid.ads--liquid--cols2to3 > article"
    );

    let annonseArr = [];

    annonser.forEach((selector) => {
      const annonseTittel = selector.querySelector(
        "div.ads__unit__content > h2"
      );
      console.log("tittel:", annonseTittel);
      if (!annonseTittel) return "Tittel ikke funnet!";

      const annonseFinnkode = selector.querySelector(
        "div.ads__unit__content > h2 > a"
      );
      console.log("finnkode:", annonseFinnkode);
      if (!annonseFinnkode) return "Finnkode ikke funnet!";

      const annonsePris = selector.querySelector(
        "article > div.ads__unit__img > div > div"
      );
      console.log("pris:", annonsePris);
      if (!annonsePris) return "Pris ikke funnet!";

      const annonseUnitDetails = selector.querySelectorAll(
        "div.ads__unit__content > div.ads__unit__content__details > div"
      );
      console.log("timestamp", annonseUnitDetails);
      if (!annonseUnitDetails) return "Timestamp ikke funnet!";

      const annonseTid = annonseUnitDetails[0];
      const annonseLokasjon = annonseUnitDetails[1];
      console.log("lokasjon", annonseLokasjon);
      if (!annonseLokasjon) return "Lokasjon ikke funnet!";

      annonseArr.push({
        tittel: annonseTittel.textContent,
        finnkode: annonseFinnkode.getAttribute("id"),
        pris: annonsePris.textContent,
        timestamp: annonseTid.textContent,
        lokasjon: annonseLokasjon.textContent,
      });
    });
    return annonseArr;
  });

  fs.renameSync(
     'output.json', 'output_old.json'
    );

  fs.writeFileSync(
    path.join(dir, "output.json"),
    JSON.stringify(getAnnonser, null, 2)
  );

  console.log(getAnnonser);

  await browser.close();
}

module.exports.start = start;
