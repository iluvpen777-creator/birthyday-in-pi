let pi = "";

async function loadPi() {

    try {

        const response = await fetch("pi.txt");
        pi = await response.text();

        document.getElementById("result").innerHTML =
            "Enter your birthday and click SEARCH.";

    } catch (error) {

        document.getElementById("result").innerHTML =
            "<div class='fail'>Failed to load pi.txt.</div>";

    }

}

loadPi();

function isValidDateFormat(value) {

    // 숫자만 허용
    if (!/^\d+$/.test(value)) return false;

    // 길이별 기본 규칙 체크
    if (value.length === 8) {
        // YYYYMMDD
        const year = parseInt(value.slice(0, 4));
        const month = parseInt(value.slice(4, 6));
        const day = parseInt(value.slice(6, 8));

        return isValidDate(year, month, day);
    }

    if (value.length === 6) {
        // YYMMDD
        const month = parseInt(value.slice(2, 4));
        const day = parseInt(value.slice(4, 6));

        return month >= 1 && month <= 12 && day >= 1 && day <= 31;
    }

    if (value.length === 4) {
        // MMDD
        const month = parseInt(value.slice(0, 2));
        const day = parseInt(value.slice(2, 4));

        return month >= 1 && month <= 12 && day >= 1 && day <= 31;
    }

    return false;
}

// YYYYMMDD 정확한 날짜 체크
function isValidDate(year, month, day) {

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // 간단한 월별 날짜 체크
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 윤년
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        daysInMonth[1] = 29;
    }

    return day <= daysInMonth[month - 1];
}

function searchPi() {

    if (pi === "") return;

    const birthday =
        document.getElementById("birthday").value.trim();

    // 숫자 검증 + 길이 검증
    if (!isValidDateFormat(birthday)) {

        alert("Please enter a valid date format (YYYYMMDD / YYMMDD / MMDD).");

        return;

    }

    const targets = [];

    if (birthday.length === 8) {

        targets.push(
            { type: "YYYYMMDD", value: birthday },
            { type: "YYMMDD", value: birthday.slice(2) },
            { type: "MMDD", value: birthday.slice(4) }
        );

    } else if (birthday.length === 6) {

        targets.push(
            { type: "YYMMDD", value: birthday },
            { type: "MMDD", value: birthday.slice(2) }
        );

    } else if (birthday.length === 4) {

        targets.push(
            { type: "MMDD", value: birthday }
        );

    }

    for (const target of targets) {

        const index = pi.indexOf(target.value);

        if (index !== -1) {

            const start = index + 1;
            const end = index + target.value.length;

            const before =
                pi.slice(Math.max(0, index - 5), index);

            const after =
                pi.slice(
                    index + target.value.length,
                    index + target.value.length + 5
                );

            document.getElementById("result").innerHTML = `

<div class="success">
Search successful!
</div>

<b>Format</b>: ${target.type}<br>
<b>Position</b>: ${start} ~ ${end}<br><br>

${before}
<span class="highlight">${target.value}</span>
${after}

`;

            return;

        }

    }

    document.getElementById("result").innerHTML =
        "<div class='fail'>No match found.</div>";

}