// Globální slovník
window.AppState = {
  data: JSON.parse(localStorage.getItem("Data")) || {},

  set(key, value) {
    this.data[key] = value;
    console.log(`AppState: ${key} =`, value);
  },

  get(key) {
    return this.data[key];
  },

  remove(key) {
    delete this.data[key];
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // uživatelé
  if (!("users" in AppState.data)) {
    AppState.data["users"] = {
        "6767676767": {
          "name": "ExampleUser123",
          "photo": "EXAMPLE.jpg",
          "heslo": "knedlicek15",
          "vzdalenost": 22,
          "pocetVyletu": 15,
          "statistiky": {}
        },
        "2345678436": {
          "name": "ToJaNevim^3",
          "photo": "EXAMPLE2.jpg",
          "heslo": "negro+",
          "vzdalenost": 3251,
          "pocetVyletu": 257,
          "statistiky": {}
        }
      }
  };
  // místa
  if (!("users" in AppState.data)) {
    AppState.data["users"] = {
        "10": {
          "name": "Ještěd",
          "photo": "Ještěd.jpg",
          "info": "Ještěd je liberecká dominanta s unikátním televizním vysílačem a hotelem, který získal prestižní architektonickou cenu.",
          "vzdalenost": 22,
          "detailInfo": "n/a",
          "popisTrasy": "n/a",
          "statistiky": {}
        },
        "20": {
          "name": "Krkonoše",
          "photo": "Krkonoše.jpg",
          "info": "Krkonoše jsou nejvyšší české pohoří s národním parkem a Sněžkou, která měří 1603 metrů.",
          "vzdalenost": 3251,
          "detailInfo": "n/a",
          "popisTrasy": "n/a",
          "statistiky": {}
        },
        "30": {
          "name": "Zámek Lednice",
          "photo": "Ještěd.jpg",
          "info": "Novogotický státní zámek na seznamu UNESCO.",
          "vzdalenost": 55,
          "detailInfo": "n/a",
          "popisTrasy": "n/a",
          "statistiky": {}
        }
      }
  };
});

// Definice funkcí
const Actions = {
  index() {
    open("index.html");
  },
  cancelSearch() {
    open("index.html");
    AppState.data["searchBar"] = "";
    reload();
  },
  sekce_komunita() {
    open("komunita.html");
  },
  sekce_vybaveni() {
    open("vybaveni.html");
  },
  sekce_ulozeno() {
    open("ulozeno.html");
  },
  sekce_profil() {
    if ("loggedUser" in AppState.data) {
        open("profil.html");
    } else {
        open("notRegistered.html");
    }
  },
  sekce_ai() {
    open("ai_chat.html");
  },
  DEMOprihlasitse() {
    AppState.data["loggedUser"] = "6767676767";
    open("profil.html");
  },
  odhlasitse() {
    AppState.remove("loggedUser");
    open("notRegistered.html");
  },
  hledani(vstup) {
    if (vstup.length > 0) {
      open("hledat.html");
    }
  },
  sos() {
    open("sos.html");
  },
  misto_info() {
    open("info_misto.html");
  },
  misto_vybaveni() {
    open("vybaveni_misto.html");
  },
  misto_pocasi() {
    open("pocasi_misto.html");
  },
  misto_navigace() {
    open("navigace.html");
  },
  naplanovat() {
    open("planovac.html");
  },
  back() {
    window.history.back();
  },
  nastaveni() {
    open("nastaveni.html");
  },
  getUserInfo(typ) {
    const users = AppState.data["users"];
    const logged = AppState.data["loggedUser"];

    if (!users || !logged || !users[logged]) return "N/A";

    return users[logged][typ] ?? "N/A";
  },
  EXAMPLE_TRASA() {
    open("info_misto.html")
  },
  EXAMPLE_PRODUKT_INFO() {
    open("info_produkt.html")
  },
  scroll_left(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft -= 100; // posuv o 100px doleva
    } else {
      console.warn(`Třída ${className} nenalezena`);
    }
  },
  scroll_right(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.scrollLeft += 100; // posuv o 100px doprava
    } else {
      console.warn(`Třída ${className} nenalezena`);
    }
  },
  vybaveni_filtruj(kategorie) {
    vybaveni_povolene_tridy.forEach(trida => {
        document.querySelectorAll("." + trida).forEach(el => {
            if (kategorie === "vse") {
                el.style.display = "flex";
            } else {
                el.style.display = (trida === kategorie) ? "flex" : "none";
            }
        });
    });
  },
};

const vybaveni_povolene_tridy = [
  "kt_obleceni",
  "kt_kemping",
  "kt_obuv",
  "kt_potraviny",
  "kt_nastroje",
  "kt_batohy",
  "kt_ostatni"
];

// Přesměrování na jinou URL s pamětí slovníku
function open(url) {
  localStorage.setItem("Data", JSON.stringify(AppState.data));
  window.location.href = url;
}
function reload() {
  localStorage.setItem("Data", JSON.stringify(AppState.data));
  window.location.reload;
}

// Globální listener pro všechny elementy s data-func
document.addEventListener("click", e => {
  const el = e.target.closest("[data-func]");
  if (!el) return;

  const funcCall = el.dataset.func;
  const match = funcCall.match(/^(\w+)\((.*)\)$/);

  // Pokud je ve formátu "funkceName(arg1, arg2)"
  if (match) {
    const funcName = match[1];
    const argsString = match[2];
    const args = argsString
      ? argsString.split(",").map(a => a.trim().replace(/^["']|["']$/g, ''))
      : [];

    if (Actions[funcName]) {
      Actions[funcName](...args);
    } else {
      console.warn("Funkce není definována:", funcName);
    }
    return;
  }

  // Fallback na starý formát pro radio buttony
  const action = Actions[funcCall];
  if (!action) {
    console.warn("Funkce není definována:", funcCall);
    return;
  }

  if (el.tagName === "INPUT" && el.type === "radio") {
    if (!el.checked) return;
    action(el.value);
  } else {
    action();
  }
});

document.addEventListener("input", e => {
  const el = e.target;
  if (!el.matches("input[type='text'][data-func]")) return;

  const funcName = el.dataset.func;
  if (Actions[funcName]) {
    Actions[funcName](el.value);
  }
});

//synchronizace textovích polí s data-bind se slovníkem
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input[type='text'][data-bind]").forEach(input => {
    const key = input.dataset.bind;

    // PŘEDVYPLNĚNÍ Z AppState
    if (AppState.data[key] !== undefined) {
      input.value = AppState.data[key];
    }

    // ZÁPIS Z INPUTU DO AppState
    input.addEventListener("input", () => {
      AppState.data[key] = input.value;
    });
  });
});

//loader slovníku
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-bind]").forEach(el => {
    const bind = el.dataset.bind;

    if (bind.startsWith("func:")) {
      const funcCall = bind.slice(5); // odstraní "func:"
      const match = funcCall.match(/^(\w+)\((.*)\)$/);

      if (match) {
        const funcName = match[1];
        const argsString = match[2];
        const args = argsString
          ? argsString.split(",").map(a => a.trim().replace(/^["']|["']$/g, ''))
          : [];

        if (Actions[funcName]) {
          el.textContent = Actions[funcName](...args);
        } else {
          console.warn(`Funkce ${funcName} není definována v Actions`);
        }
      }
    } else {
      const key = bind;
      el.textContent = AppState.data[key];
    }
  });
});