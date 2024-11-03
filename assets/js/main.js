let TArticles = [];

function init() {
  $.ajax({
    url: "./assets/data/articles.json",
    method: "GET",
    success: function (data) {
      TArticles = data;
      let select = $("#pizza");
      TArticles.forEach(function (item) {
        let option = `<option value="${item.Code}">${item.designation} - ${item.Prix} DH</option>`;
        select.append(option);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
}

let TArticlesChoisis = []; 

function ajouter() {
  
  const nom = $('#nom').val();
  const adresse = $('#adresse').val();
  const pizzaCode = $('#pizza').val();
  const quantite = parseInt($('#quantite').val());
  const paiment = $('input[name="paiment"]:checked').val();
  const num = $('#num').val();

  
  if (!nom || !adresse || !pizzaCode || quantite < 1 || quantite > 10 || !paiment || (paiment === 'card' && !num)) {
    alert('Veuillez remplir correctement le formulaire.');
    return;
  }

  
  if (paiment === 'card' && (!num || num.length !== 16)) {
    alert('Veuillez entrer un numéro de carte bancaire valide.');
    return;
  }

  
  const selectedPizza = TArticles.find(p => p.Code === pizzaCode);

  
  TArticlesChoisis.push({
    designation: selectedPizza.designation,
    prix: selectedPizza.Prix,
    quantite: quantite
  });

  
  const newRow = `
    <tr>
      <td>${selectedPizza.designation}</td>
      <td>${selectedPizza.Prix} DH</td>
      <td>${quantite}</td>
    </tr>`;
  $('table tbody').append(newRow);

  
  let total = TArticlesChoisis.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  $('tfoot td:last-child').text(`${total} DH`);

  
  $('.message').text(`Merci pour votre visite. Le total de votre commande est: ${total} DH`);

  
  $('#form')[0].reset(); 

  
  $('#num').prop('disabled', true);
}

$(document).ready(function () {
  init();
  
  
  $('input[name="paiment"]').change(function () {
    if ($('#cheque').is(':checked')) {
      $('#num').prop('disabled', true); 
      $('#num').val(''); 
    } else {
      $('#num').prop('disabled', false); 
    }
  });

  
  $('#form').submit(function (event) {
    event.preventDefault(); 
    ajouter(); 
  });


  $('#envoyer').click(function () {
    
    if (TArticlesChoisis.length === 0) {
      alert("Veuillez ajouter des articles à votre commande avant d'envoyer.");
      return;
    }

    
    let content = "<p>Commande récapitulative:</p><ul>";
    TArticlesChoisis.map(item => {
      content += `<li>${item.designation} - ${item.quantite} x ${item.prix} DH</li>`;
    });
    content += "</ul>";

    
    let total = TArticlesChoisis.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    content += `<p>Total: ${total} DH</p>`;
    content += '<button onclick="window.print()">Imprimer</button>';
    content += '<button onclick="window.close()">Quitter</button>';

    
    let popupWindow = window.open("", "popup", "width=400,height=400");
    popupWindow.document.write(content);
  });
});
