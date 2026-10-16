let students = [];
try { students = JSON.parse(localStorage.getItem("students")) || []; } catch (e) {}

const $ = id => document.getElementById(id);
const esc = s => { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; };

function grade(p) {
    if (p >= 90) return ["A+", "#06b67f"];
    if (p >= 80) return ["A", "#2fb344"];
    if (p >= 70) return ["B", "#0f6bd6"];
    if (p >= 60) return ["C", "#e6a700"];
    if (p >= 40) return ["D", "#f08a24"];
    return ["F", "#e5484d"];
}

function save() {
    try { localStorage.setItem("students", JSON.stringify(students)); } catch (e) {}
}

function render() {
    // rank by total, highest first
    students.sort((a, b) => b.total - a.total);

    $("tbody").innerHTML = students.map((s, i) => {
        const [g, c] = grade(s.percent);
        return `<tr class="${i === 0 ? "top" : ""}">
            <td>${i === 0 ? "👑" : i + 1}</td>
            <td>${esc(s.name)}</td>
            <td>${esc(s.roll)}</td>
            <td>${s.total}/400</td>
            <td>${s.percent.toFixed(2)}%</td>
            <td><span class="badge" style="background:${c}">${g}</span></td>
            <td><button class="del" onclick="removeStudent(${s.id})">✕</button></td>
        </tr>`;
    }).join("");

    $("empty").style.display = students.length ? "none" : "block";
    $("count").textContent = students.length ? `(${students.length})` : "";

    const t = $("topper");
    if (students.length) {
        const top = students[0];
        t.className = "topper win";
        t.innerHTML = `🏆 Topper: <b>${esc(top.name)}</b> (Roll ${esc(top.roll)}) — ${top.total}/400 · ${top.percent.toFixed(2)}%`;
    } else {
        t.className = "topper";
        t.textContent = "Add students to find the topper 🏆";
    }
}

$("form").addEventListener("submit", e => {
    e.preventDefault();
    const marks = ["m1", "m2", "m3", "m4"].map(id => Number($(id).value));
    if (marks.some(m => m < 0 || m > 100)) return alert("Marks must be between 0 and 100");

    const roll = $("roll").value.trim();
    if (students.some(s => s.roll === roll)) return alert("Roll number already exists!");

    const total = marks.reduce((a, b) => a + b, 0);
    students.push({
        id: Date.now(),
        name: $("name").value.trim(),
        roll,
        total,
        percent: total / marks.length   // each subject is out of 100
    });

    save(); render();
    e.target.reset();
    $("name").focus();
});

function removeStudent(id) {
    students = students.filter(s => s.id !== id);
    save(); render();
}

render();