// Konfiguracja Firebase (weź swoje dane z panelu Firebase)
var firebaseConfig = {
    apiKey: "twoje-api-key",
    authDomain: "twoje-auth-domain",
    projectId: "twoje-project-id",
    storageBucket: "twoje-storage-bucket",
    messagingSenderId: "twoje-messaging-sender-id",
    appId: "twoje-app-id"
};

// Inicjalizacja Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Funkcja dodawania artysty do Firestore
function addArtist() {
    var artistName = document.getElementById("artist-name").value;
    db.collection("artists").add({
        name: artistName
    }).then(() => {
        alert("Artysta dodany!");
        updateArtists(); // Odśwież listę artystów
    }).catch((error) => {
        console.error("Błąd dodawania artysty: ", error);
    });
}

// Funkcja dodawania piosenki do Firestore
function addSong() {
    var songTitle = document.getElementById("song-title").value;
    var songArtist = document.getElementById("song-artist").value;
    db.collection("songs").add({
        title: songTitle,
        artist: songArtist,
        totalStreams: Math.floor(Math.random() * 10000000),
        highestPosition: 0
    }).then(() => {
        alert("Piosenka dodana!");
        updateRanking(); // Odśwież ranking piosenek
    }).catch((error) => {
        console.error("Błąd dodawania piosenki: ", error);
    });
}

// Funkcja pobierania artystów z Firestore i wyświetlanie ich
function updateArtists() {
    let artistList = document.getElementById("artist-list");
    artistList.innerHTML = "";
    db.collection("artists").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let artist = doc.data();
            let li = document.createElement("li");
            li.textContent = artist.name;
            artistList.appendChild(li);
        });
    });
}

// Funkcja pobierania piosenek z Firestore i aktualizowanie rankingu
function updateRanking() {
    let rankingList = document.getElementById("global-ranking");
    rankingList.innerHTML = "";
    db.collection("songs").orderBy("totalStreams", "desc").limit(10).get().then((querySnapshot) => {
        querySnapshot.forEach((doc, index) => {
            let song = doc.data();
            let li = document.createElement("li");
            li.textContent = `#${index + 1} - ${song.title} (${song.artist}) - 🔥 ${song.totalStreams.toLocaleString()} odtworzeń`;
            rankingList.appendChild(li);
        });
    });
}

// Funkcja aktualizowania liczby odtworzeń co 2 minuty
function updateStreams() {
    db.collection("songs").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let songRef = doc.ref;
            let song = doc.data();
            let newStreams = song.totalStreams + Math.floor(Math.random() * 10000000);
            songRef.update({
                totalStreams: newStreams
            }).then(() => {
                console.log(`Zaktualizowano odtworzenia dla piosenki: ${song.title}`);
                updateRanking(); // Odśwież ranking po każdej aktualizacji
            }).catch((error) => {
                console.error("Błąd aktualizacji odtworzeń: ", error);
            });
        });
    });
}

// Funkcja uruchamiania aktualizacji co 2 minuty
setInterval(updateStreams, 2 * 60 * 1000);  // Co 2 minuty

// Uruchomienie funkcji po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    updateArtists();
    updateRanking();
});
