const compareEntireString = (ingredient, product) => {
  ingredient = ingredient
    .replace(/\d+/g, "")
    .replace(/łyżeczka|łyżeczki|łyżka|łyżki|kostka|szczypty|szczypta/, "")
    .replace(",", "")
    .replace("%", "")
    .replace("g", "")
    .trim();

  product = product[0].toLowerCase() + product.slice(1);

  // wyrownywanie wyrazow tak, aby zaczynaly sie na tych samych pozycjach
  product = product.split("");
  ingredient = ingredient.split("");

  const length = ingredient.length;
  for (let i = 0; i < length; i++) {
    if (ingredient[i] === " " && product[i] !== " ") {
      ingredient.splice(i, 0, " ");
    }

    if (ingredient[i] !== " " && product[i] === " ") {
      product.splice(i, 0, " ");
    }
  }
  product = product.join("");
  ingredient = ingredient.join("");

  // ustawianie rownych odleglosci
  if (ingredient.length > product.length) {
    ingredient = ingredient.slice(0, product.length);
  } else {
    product = product.slice(0, ingredient.length);
  }

  // mierzenie odleglosci Hamminga
  let distance = 0;
  for (let i = 0; i < ingredient.length; i++) {
    if (ingredient[i] !== product[i]) {
      distance++;
    }
  }

  // sprawdzanie warunku poprawnosci
  if (distance < ingredient.length / 2) {
    return true;
  } else {
    return false;
  }
};

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

const compareOneWord = (word1, word2) => {
  word1 = word1[0].toLowerCase() + word1.slice(1);
  word2 = word2[0].toLowerCase() + word2.slice(1);

  let distance = levenshteinDistance(word1, word2);

  // sprawdzanie warunku poprawnosci
  if (distance < word1.length / 2) {
    return true;
  } else {
    return false;
  }
};

module.exports = { compareEntireString, compareOneWord };
