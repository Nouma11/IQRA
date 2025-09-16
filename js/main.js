function showPage(pageId) {
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.remove("active");
        sec.style.display = "none";
    });

    document.querySelectorAll("header nav ul li a").forEach(link => {
        link.classList.remove("active");
    });

    const activeSection = document.getElementById(pageId);
    if (activeSection) {
        activeSection.classList.add("active");
        if (pageId === "home") {
            activeSection.style.display = "flex";
        } else if (pageId === "surah" || pageId === "translation") {
            activeSection.style.display = "grid";
        } else {
            activeSection.style.display = "flex";
        }
    }

    const activeLink = document.querySelector(
        `header nav ul li a[onclick="showPage('${pageId}')"]`
    );
    if (activeLink) {
        activeLink.classList.add("active");
    }

    if (pageId === "surah") {
        showSurah();
    }
    if (pageId === "translation") {
        showSurahTranslation();
    }
    if (pageId === "about") {
        showAbout();
    }
}

function showAbout() {
    const sec = document.getElementById("about");
    sec.innerHTML = `
        <div style="max-width:900px; margin:auto; text-align:center; animation: fadeIn 1s ease-in-out;">
            <h1 style="font-size:36px; margin-bottom:20px; color:var(--main-color);">About Us</h1>
            <p style="font-size:20px; line-height:1.8; color:white; margin-bottom:30px;">
                Welcome to <strong>IQRA</strong>, your go-to web application for reading and listening to the Quran.
                Our mission is to make the Quran accessible to everyone, everywhere.
                Whether you want to read the verses in Arabic or explore their English translations, IQRA has got you covered.
            </p>

            <h2 style="font-size:28px; margin:30px 0 15px; color:var(--main-color);">Key Features</h2>
            <ul style="text-align:left; max-width:650px; margin:0 auto 40px; font-size:18px; line-height:1.8; color:white;">
                <li>Read Quranic verses in Arabic with proper formatting.</li>
                <li>Access English translations of each Surah.</li>
                <li>Listen to high-quality recitations of the entire Quran or individual verses.</li>
                <li>View detailed Tafsir (exegesis) for deeper understanding of the verses.</li>
            </ul>

            <h2 style="font-size:28px; margin:30px 0 15px; color:var(--main-color);">About this Demo</h2>
            <p style="font-size:18px; line-height:1.8; max-width:750px; margin:0 auto; color:white;">
                This application is a <strong>demonstration project</strong> designed to make the Quran easy to read, listen to, and explore. 
                For this demo release we provide:
            </p>
            <ul style="text-align:left; max-width:650px; margin:20px auto; font-size:18px; line-height:1.8; color:white;">
                <li><strong>English translation</strong> (only English in this version)</li>
                <li><strong>Recitation by Yasser Al-Dossari</strong> (primary reciter)</li>
                <li><strong>Tafsir Ibn Kathir</strong> (verse-by-verse explanations)</li>
            </ul>

            <p style="font-size:18px; line-height:1.8; max-width:750px; margin:20px auto; color:white;">
                The app is intended as a lightweight, educational tool — not a comprehensive production release. 
                Resources are sourced from public repositories and licensed audio providers. 
                Your feedback, bug reports, and suggestions are highly appreciated and will guide future improvements.
            </p>

            <p style="font-size:18px; line-height:1.8; margin-top:30px; color:white;">
                May this small project be beneficial. If you’d like additional languages, reciters, or extended tafsir support, let us know.
            </p>
        </div>
    `;
}

async function showSurahTranslation() {
    let audio1 = document.createElement("audio");
    let sec = document.getElementById("translation");
    sec.innerHTML = "";
    let res = await fetch("https://quranapi.pages.dev/api/surah.json");
    let data = await res.json();

    data.forEach((obj, i) => {
        let cart = document.createElement("div");
        cart.className = "surah-card";

        let h3 = document.createElement("h3");
        h3.textContent = obj.surahName + " : ENG";
        h3.style.cssText =
            "text-align:center; font-size:25px; font-weight:600;";

        let p = document.createElement("p");
        p.textContent = `Total Ayah: ${obj.totalAyah}`;

        cart.appendChild(h3);
        cart.appendChild(p);

        cart.addEventListener("click", async () => {
            localStorage.setItem("surah", i + 1);
            document.querySelectorAll("section").forEach(sec => {
                sec.classList.remove("active");
                sec.style.display = "none";
            });

            const activesec = document.getElementById("surah-page");
            if (activesec) {
                activesec.classList.add("active");
                activesec.style.display = "flex";
                activesec.innerHTML = "";

                // Play Whole Surah Button
                let play = document.createElement("button");
                play.className = "play";
                play.textContent = "▶️ Play Whole Surah";
                play.style.cssText =
                    "margin-bottom:20px; padding:10px; font-size:18px; cursor:pointer; background:greenyellow; border:none; border-radius:8px;";
                let audio = document.createElement("audio");
                play.addEventListener("click", async () => {
                    audio.controls = true;
                    audio.style.width = "100%";
                    if (
                        !audio1.paused &&
                        !audio1.ended &&
                        audio1.readyState > 2
                    ) {
                        audio1.pause();
                    }
                    let src = await fetch(
                        `https://quranapi.pages.dev/api/audio/${i + 1}.json`
                    )
                        .then(res => res.json())
                        .then(data => data["4"].originalUrl);

                    audio.src = src;
                    activesec.insertBefore(audio, activesec.firstChild);
                    audio.play();
                });

                activesec.appendChild(play);

                // Fetch Translation
                let res1 = await fetch(
                    `https://quranapi.pages.dev/api/english.json`
                );
                let data1 = await res1.json().then(data => data[i].translation);

                data1.forEach((verse, j) => {
                    let span = document.createElement("span");
                    span.textContent = verse + ` (${j + 1}) `;

                    let btn = document.createElement("button");
                    btn.className = "show-tafsir";
                    btn.textContent = "Show Tafsir";

                    span.style.display = "block";
                    span.style.margin = "15px 0";
                    span.style.fontSize = "28px";
                    span.style.cursor = "pointer";

                    span.appendChild(btn);

                    // Verse audio
                    span.addEventListener("click", async () => {
                        audio1.controls = true;
                        audio1.style.width = "100%";

                        if (
                            !audio.paused &&
                            !audio.ended &&
                            audio.readyState > 2
                        ) {
                            audio.pause();
                        }

                        let src = await fetch(
                            `https://quranapi.pages.dev/api/audio/${
                                i + 1
                            }/${j + 1}.json`
                        )
                            .then(res => res.json())
                            .then(data => data["4"].originalUrl);

                        audio1.src = src;
                        span.insertAdjacentElement("afterend", audio1);
                        audio1.play();
                    });

                    // Tafsir
                    btn.addEventListener("click", async e => {
                        e.stopPropagation();
                        document
                            .querySelectorAll(".tafsir-box")
                            .forEach(box => box.remove());

                        let tafsirBox = document.createElement("div");
                        tafsirBox.className = "tafsir-box";
                        tafsirBox.textContent = "Loading tafsir...";
                        tafsirBox.style.color = "black";

                        let closeBtn = document.createElement("span");
                        closeBtn.className = "close-tafsir";
                        closeBtn.innerHTML = "&times;";
                        tafsirBox.appendChild(closeBtn);

                        closeBtn.addEventListener("click", () => {
                            tafsirBox.remove();
                        });

                        activesec.appendChild(tafsirBox);

                        try {
                            let tafsirRes = await fetch(
                                `https://quranapi.pages.dev/api/tafsir/${
                                    i + 1
                                }_${j + 1}.json`
                            );
                            let tafsirData = await tafsirRes.json();
                            tafsirBox.textContent =
                                tafsirData.tafsirs[0].content ||
                                "No tafsir available.";
                            tafsirBox.appendChild(closeBtn);
                        } catch {
                            tafsirBox.textContent =
                                "⚠️ Could not load tafsir.";
                            tafsirBox.appendChild(closeBtn);
                        }
                    });

                    activesec.appendChild(span);
                });
            }
        });

        sec.appendChild(cart);
    });
}

async function showSurah() {
    let audio1 = document.createElement("audio");
    let sec = document.getElementById("surah");
    sec.innerHTML = "";
    let res = await fetch("https://quranapi.pages.dev/api/surah.json");
    let data = await res.json();

    data.forEach((obj, i) => {
        let cart = document.createElement("div");
        cart.className = "surah-card";

        let h3 = document.createElement("h3");
        h3.textContent = obj.surahName;
        h3.style.cssText =
            "text-align:center; font-size:25px; font-weight:600;";

        let p = document.createElement("p");
        p.textContent = `Total Ayah: ${obj.totalAyah}`;

        cart.appendChild(h3);
        cart.appendChild(p);

        cart.addEventListener("click", async () => {
            localStorage.setItem("surah", i + 1);
            document.querySelectorAll("section").forEach(sec => {
                sec.classList.remove("active");
                sec.style.display = "none";
            });

            const activesec = document.getElementById("surah-page");
            if (activesec) {
                activesec.classList.add("active");
                activesec.style.display = "flex";
                activesec.innerHTML = "";

                // Play Whole Surah Button
                let play = document.createElement("button");
                play.className = "play";
                play.textContent = "▶️ Play Whole Surah";
                play.style.cssText =
                    "margin-bottom:20px; padding:10px; font-size:18px; cursor:pointer; background:greenyellow; border:none; border-radius:8px;";
                let audio = document.createElement("audio");
                play.addEventListener("click", async () => {
                    audio.controls = true;
                    audio.style.width = "100%";
                    if (
                        !audio1.paused &&
                        !audio1.ended &&
                        audio1.readyState > 2
                    ) {
                        audio1.pause();
                    }
                    let src = await fetch(
                        `https://quranapi.pages.dev/api/audio/${i + 1}.json`
                    )
                        .then(res => res.json())
                        .then(data => data["4"].originalUrl);

                    audio.src = src;
                    activesec.insertBefore(audio, activesec.firstChild);
                    audio.play();
                });

                activesec.appendChild(play);

                // Fetch Arabic verses
                let res1 = await fetch(
                    `https://quranapi.pages.dev/api/${i + 1}.json`
                );
                let data1 = await res1.json();

                data1.arabic1.forEach((verse, j) => {
                    let span = document.createElement("span");
                    span.textContent = verse + ` (${j + 1}) `;

                    let btn = document.createElement("button");
                    btn.className = "show-tafsir";
                    btn.textContent = "Show Tafsir";

                    span.style.display = "block";
                    span.style.margin = "15px 0";
                    span.style.fontSize = "28px";
                    span.style.cursor = "pointer";

                    span.appendChild(btn);

                    // Verse audio
                    span.addEventListener("click", async () => {
                        audio1.controls = true;
                        audio1.style.width = "100%";

                        if (
                            !audio.paused &&
                            !audio.ended &&
                            audio.readyState > 2
                        ) {
                            audio.pause();
                        }

                        let src = await fetch(
                            `https://quranapi.pages.dev/api/audio/${
                                i + 1
                            }/${j + 1}.json`
                        )
                            .then(res => res.json())
                            .then(data => data["4"].originalUrl);

                        audio1.src = src;
                        span.insertAdjacentElement("afterend", audio1);
                        audio1.play();
                    });

                    // Tafsir
                    btn.addEventListener("click", async e => {
                        e.stopPropagation();
                        document
                            .querySelectorAll(".tafsir-box")
                            .forEach(box => box.remove());

                        let tafsirBox = document.createElement("div");
                        tafsirBox.className = "tafsir-box";
                        tafsirBox.textContent = "Loading tafsir...";
                        tafsirBox.style.color = "black";

                        let closeBtn = document.createElement("span");
                        closeBtn.className = "close-tafsir";
                        closeBtn.innerHTML = "&times;";
                        tafsirBox.appendChild(closeBtn);

                        closeBtn.addEventListener("click", () => {
                            tafsirBox.remove();
                        });

                        activesec.appendChild(tafsirBox);

                        try {
                            let tafsirRes = await fetch(
                                `https://quranapi.pages.dev/api/tafsir/${
                                    i + 1
                                }_${j + 1}.json`
                            );
                            let tafsirData = await tafsirRes.json();
                            tafsirBox.textContent =
                                tafsirData.tafsirs[0].content ||
                                "No tafsir available.";
                            tafsirBox.appendChild(closeBtn);
                        } catch {
                            tafsirBox.textContent =
                                "⚠️ Could not load tafsir.";
                            tafsirBox.appendChild(closeBtn);
                        }
                    });

                    activesec.appendChild(span);
                });
            }
        });

        sec.appendChild(cart);
    });
}

// "Read Quran" button
document.querySelector(".read").addEventListener("click", () => {
    showPage("surah");
});

// "Listen Quran" button
document.querySelector(".listen").addEventListener("click", async () => {
    let surah = localStorage.getItem("surah");
    if (surah) {
        let audio = document.createElement("audio");
        audio.controls = true;
        audio.style.width = "100%";

        let src = await fetch(
            `https://quranapi.pages.dev/api/audio/${surah}.json`
        )
            .then(res => res.json())
            .then(data => data["4"].originalUrl);
        audio.src = src;

        audio.play();
        const activeSection = document.getElementById("home");
        let control = document.createElement("div");
        control.className = "surah-listen-control";
        let h3 = document.createElement("h3");
        let index = localStorage.getItem("surah");
        let data = await fetch(`https://quranapi.pages.dev/api/surah.json`)
            .then(res => res.json())
            .then(data => data[index - 1].surahName);
        h3.textContent = data;
        control.appendChild(h3);
        let img = document.createElement("img");
        img.src = "/images/wave-sound.png";
        control.appendChild(img);
        activeSection.appendChild(control);
    }
});

// ===== Responsive Nav Toggle =====
let nav = document.querySelector("header nav");
let navul = document.querySelector("header nav ul");
let menuicon = document.querySelector(".fa-bars");

let xbutton = document.createElement("button");
xbutton.className = "btn";

let xicon = document.createElement("i");
xicon.className = "fa-solid fa-xmark";
xbutton.appendChild(xicon);

let li = document.createElement("li");
li.appendChild(xbutton);

menuicon.addEventListener("click", () => {
    nav.classList.add("active");
    if (!navul.contains(li)) navul.prepend(li);
});

// Toggle nav open
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("navbar").classList.add("active");
});

// Close nav button
document.getElementById("close-nav").addEventListener("click", () => {
  document.getElementById("navbar").classList.remove("active");
});

// Close nav when clicking a link
document.querySelectorAll("#navbar ul li a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navbar").classList.remove("active");
  });
});

// Close nav when clicking outside
document.addEventListener("click", (e) => {
  const nav = document.getElementById("navbar");
  const toggle = document.getElementById("menu-toggle");
  if (nav.classList.contains("active") && !nav.contains(e.target) && e.target !== toggle) {
    nav.classList.remove("active");
  }
});
