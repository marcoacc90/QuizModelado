var app = angular.module('quiz',["angular-bind-html-compile","ngMessages","ngJaxBind"]);

app.run(function( $rootScope, $http, $sce )
{

  

  /*$rootScope.current_template = 'resources/html/home.html';*/
  $rootScope.current_template = 'resources/html/quiz.html';
  $rootScope.credits_data={};
  $rootScope.quiz_original_data={};
  $rootScope.number_correct_answers=0;
  $rootScope.number_questions=0;
  $rootScope.quiz = {};

  /**********************************GET CREDITS XML FILE*****************************************************/

  $http({

    method: 'GET',
    url: 'resources/xml/credits.xml'

  }).success(function(data, status, headers, config){
    var x2js = new X2JS();
    formatCredits( x2js.xml_str2json(data).credit );
  }).error(function(data, status, headers, config){
    alert("Ha fallado la petición, no se ha podido leer el archivo de configuración. Estado HTTP:"+status);
  });

  /**********************************GET QUIZ JSON FILE*****************************************************/

  $http({

    method: 'GET',
    url: 'resources/json/quiz.json'

  }).success(function(data, status, headers, config){
    $rootScope.quiz_original_data = data;
  }).error(function(data, status, headers, config){
    alert("Ha fallado la petición, no se ha podido leer el archivo de configuración. Estado HTTP:"+status);
  });

  /*******************************************FORMAT CREDISTS**********************************************/
  function formatCredits(data) {
    var content=" ";
    var i;
    $rootScope.credits_data.title = data.title;

    content += formatInstitutionsCredits(data.institutions);

    content += "<p class=\"text_title\">CONDICIONES DE USO</p>";
    content += "<p class=\"text_normal\">"+data.terms.legend+
    "<br>"+data.terms.year+"</p><br>";

    content += "<p class=\"text_title\">CRÉDITOS</p><br>";
    content += formatParticipantsCredits("Contenido", data.participants.content);
    content += formatParticipantsCredits("Desarrollo", data.participants.developer);
    content += formatParticipantsCredits("Ilustración", data.participants.ilustration);
    content += formatParticipantsCredits("Modelado 3D", data.participants.model3D);
    content += formatParticipantsCredits("Gestión del proyecto", data.participants.manager);

    content += formatMaterialsCredits("Material Externo", data.materials.material);

    content += "<p class=\"text_title\">FINANCIAMIENTO</p>";
    content += "<p class=\"text_normal\">"+data.funding.legend+"</p>";

    $rootScope.credits_data.formated = content;
  }

  function formatInstitutionsCredits(element) {
    var content="";
    if(Array.isArray(element)){

      for (i = 0; i < element.length; i++) {
        content += "<p class=\"text_normal\">"+element[i].university+"</p>";

        if (Array.isArray(element[i].institution)) {
          for (k = 0; k < element[i].institution.length; k++) {
            content += "<p class=\"text_normal\">"+element[i].institution[k].name+
            "<br>"+element[i].institution[k].acronym+"</p>";
          }
        }else {
          content += "<p class=\"text_normal\">"+element[i].institution.name+
          "<br>"+element[i].institution.acronym+"</p>";
        }
        content += "<br>";
      }

    }else {
      content += "<p class=\"text_normal\">"+element.university+"</p>";

      if (Array.isArray(element.institution)) {
        for (k = 0; k < element.institution.length; k++) {
          content += "<p class=\"text_normal\">"+element.institution[k].name+
          "<br>"+element.institution[k].acronym+"</p>";
        }
      }else {
        content += "<p class=\"text_normal\">"+element.institution.name+
        "<br>"+element.institution.acronym+"</p>";
      }
      content += "<br>";
    }
    return content;
  }

  function formatParticipantsCredits(title, element) {
    var content = " ";
    if (element) {
      content += "<p class=\"text_subtitle\">"+title+"</p>";
      if (Array.isArray(element)) {
        for (var i = 0; i < element.length; i++) {
          content += "<p class=\"text_normal\">";
          if (element[i].title) {
            content += element[i].title+"<br>";
          }
          content += element[i].name+", "+element[i].institution+"<br>"+element[i].email+"</p>";
        }
      }else {
        content += "<p class=\"text_normal\">";
        if (element.title) {
          content += element.title+"<br>";
        }
        content += element.name+", "+element.institution+"<br>"+element.email+"</p>";
      }
      content += "<br>";
    }
    return content;
  }


  function formatMaterialsCredits(title, element) {
    var content = " ";
    if (element) {
      content += "<p class=\"text_subtitle\">"+title+"</p>";
      if (Array.isArray(element)) {
        for (var i = 0; i < element.length; i++) {
          content += "<p class=\"text_normal\">"+
          element[i].type+"<br>"+
          element[i].title+"<br>"+
          element[i].author+"<br>"+
          element[i].url+"<br>"+
          "</p>";
        }
      }else {
        content += "<p class=\"text_normal\">"+element.type+"<br>"+element.description+"</p>";
      }
      content += "<br>";
    }
    return content;
  }


  $rootScope.goToHomeScreen = function () {
    /*$rootScope.current_template = 'resources/html/home.html';*/
  };

});
