app.controller('QuizResultsController',function($scope, $rootScope, $http, $sce, $timeout){

  $scope.title_accordion = "Ver resultado de cada pregunta";
  $scope.feedback = null;

  $scope.showQuestionsResults = function(){
    var waitForRender = function()
    {
      if($http.pendingRequests.length > 0)
      {
        $timeout(waitForRender); // Wait for all templates to be loaded
      }
      else
      {
        for (var i = 0; i < $rootScope.quiz.question.length; i++) {
          $('#feedbackButton'+i).css('height', $('#resQuestion'+i).outerHeight());
        }

      }
    };

    $timeout(waitForRender);
  };

  $scope.showQuestionFeedback = function(feedbackText) {
    $scope.feedback=$sce.trustAsHtml(feedbackText);
  };

  /*******************************************EVALUATION ANSWERS*****************************************************/
  function EvaluationAnswers()
  {
    var q;
    var k;
    var tmpClass;

    $rootScope.number_correct_answers=0;

    for(q=0; q<$rootScope.number_questions; q++)
    {
      $rootScope.quiz.question[q].html_feedback = "";

      if("CheckBox"==$rootScope.quiz.question[q].type || "ImageCheckBox"==$rootScope.quiz.question[q].type || "VideoCheckBox"==$rootScope.quiz.question[q].type)
      {
        var correct=0;

        for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
        {
          if($rootScope.quiz.question[q].options.option[k].selected==$rootScope.quiz.question[q].options.option[k].truth)
          {
            correct = correct+1;
          }
        }

        if(correct == $rootScope.quiz.question[q].options.option.length)
        {
          $rootScope.number_correct_answers = $rootScope.number_correct_answers + 1;
          $rootScope.quiz.question[q].is_correct_answer = true;
        }

        if("CheckBox"==$rootScope.quiz.question[q].type || "VideoCheckBox"==$rootScope.quiz.question[q].type)
        {
          $rootScope.quiz.question[q].html_text_options_result = $sce.trustAsHtml(
            "<ul>"+
            "<li ng-repeat=\"optr"+q+" in quiz.question["+q+"].options.option | filter:{selected: 1}\">"+
            "<span mathjax-bind=\"optr"+q+".html\"></span>"+
            "</li>"+
            "</ul>"
          );

          for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
          {
            tmpClass = "danger";

            if ( ($rootScope.quiz.question[q].options.option[k].feedback!=="") && $rootScope.quiz.question[q].options.option[k].selected ) {

              if($rootScope.quiz.question[q].options.option[k].selected==$rootScope.quiz.question[q].options.option[k].truth){
                tmpClass = "success";
              }

              $rootScope.quiz.question[q].html_feedback +=
              "<tr class=\"row lv_row\">"+
              "<td class=\"col-xs-3 text-center\" style=\"vertical-align: middle;\">"+
              "<span mathjax-bind=\"quiz.question["+q+"].options.option["+k+"].html\"></span>"+
              "</td>"+
              "<td class=\"col-xs-9 text-center\" style=\"vertical-align: middle;\">"+
              $rootScope.quiz.question[q].options.option[k].feedback+
              "</td>"+
              "</tr>";
            }
          }
        }
        else
        {
          $rootScope.quiz.question[q].html_text_options_result = $sce.trustAsHtml(
            "<div id=\"lv_carousel"+q+"\" class=\"carousel slide\" data-ride=\"carousel\" style=\"max-width:160px; margin:auto;\">"+
            "<ol class=\"carousel-indicators\">"+
            "<li data-target=\"#lv_carousel"+q+"\" data-slide-to=\"{{$index}}\" ng-repeat=\"optr"+q+" in quiz.question["+q+"].options.option | filter:{selected: 1}\" ng-class=\"{active: 0==$index}\"></li>"+
            "</ol>"+

            "<div class=\"carousel-inner\" role=\"listbox\">"+
            "<div class=\"item\"  ng-class=\"{active: 0==$index}\" ng-repeat=\"optr_"+q+" in quiz.question["+q+"].options.option | filter:{selected: 1}\">"+
            "<img ng-src=\"{{optr_"+q+".src}}\" alt=\"\" class=\"img-responsive\">"+
            "</div>"+
            "</div>"+

            "<a class=\"left carousel-control\" data-target=\"#lv_carousel"+q+"\" role=\"button\" data-slide=\"prev\">"+
            "<span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>"+
            "</a>"+
            "<a class=\"right carousel-control\" data-target=\"#lv_carousel"+q+"\" role=\"button\" data-slide=\"next\">"+
            "<span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>"+
            "</a>"+
            "</div>"
          );

          for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
          {
            tmpClass = "danger";

            if ( ($rootScope.quiz.question[q].options.option[k].feedback!=="") && $rootScope.quiz.question[q].options.option[k].selected ) {

              if($rootScope.quiz.question[q].options.option[k].selected==$rootScope.quiz.question[q].options.option[k].truth){
                tmpClass = "success";
              }

              $rootScope.quiz.question[q].html_feedback +=
              "<tr class=\" row lv_row\">"+
              "<td class=\"col-xs-3 text-center\" style=\"vertical-align: middle;  max-width:210px;\">"+
              "<img class=\"img-responsive\" ng-src=\""+$rootScope.quiz.question[q].options.option[k].src+"\">"+
              "</td>"+
              "<td class=\"col-xs-9 text-center\" style=\"vertical-align: middle;\">"+
              $rootScope.quiz.question[q].options.option[k].feedback+
              "</td>"+
              "</tr>";
            }
          }

        }

      }
      else
      {
        tmpClass = "danger";

        if ("Number" == $rootScope.quiz.question[q].type)
        {
          $rootScope.quiz.question[q].selected_answer = parseFloat($rootScope.quiz.question[q].selected_answer);
          $rootScope.quiz.question[q].correct_answer = parseFloat($rootScope.quiz.question[q].correct_answer);
        }

        if($rootScope.quiz.question[q].selected_answer==$rootScope.quiz.question[q].correct_answer)
        {
          $rootScope.number_correct_answers = $rootScope.number_correct_answers + 1;
          $rootScope.quiz.question[q].is_correct_answer = true;
          tmpClass = "success";
        }

        if("ImageRadioButton"==$rootScope.quiz.question[q].type)
        {
          $rootScope.quiz.question[q].html_text_options_result = $sce.trustAsHtml(
            "<img style=\"max-width:160px; margin:auto;\" ng-src=\"{{quiz.question["+q+"].selected_answer}}\" alt=\"\" class=\"img-responsive\">"
          );

          for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
          {
            if ( ($rootScope.quiz.question[q].selected_answer==$rootScope.quiz.question[q].options.option[k].src) && ($rootScope.quiz.question[q].options.option[k].feedback!=="")) {

              $rootScope.quiz.question[q].html_feedback +=
              "<tr class=\"row lv_row\">"+
              "<td class=\"col-xs-3 text-center\" style=\"vertical-align: middle; max-width:210px;\">"+
              "<img class=\"img-responsive\" ng-src=\""+$rootScope.quiz.question[q].options.option[k].src+"\">"+
              "</td>"+
              "<td class=\"col-xs-9 text-center\" style=\"vertical-align: middle;\">"+
              $rootScope.quiz.question[q].options.option[k].feedback+
              "</td>"+
              "</tr>";
              break;
            }
          }


        }
        else
        {

          if ("Number" == $rootScope.quiz.question[q].type || "DropDownList" == $rootScope.quiz.question[q].type || "VideoDropDownList" == $rootScope.quiz.question[q].type) {
            $rootScope.quiz.question[q].html_text_options_result = $sce.trustAsHtml("<ul><li>"+$rootScope.quiz.question[q].selected_answer+"</li></ul>");
          }
          else{
            for(var w=0; w<$rootScope.quiz.question[q].options.option.length; w++){
              if ( $rootScope.quiz.question[q].options.option[w].text == $rootScope.quiz.question[q].selected_answer) {
                $rootScope.quiz.question[q].html_text_options_result = "<ul><li><span mathjax-bind=\"quiz.question["+q+"].options.option["+w+"].html\"></span></li></ul>";
                break;
              }
            }
          }


          if ("Number" == $rootScope.quiz.question[q].type) {
            $rootScope.quiz.question[q].html_feedback = "<table class=\"table\"><tbody><tr class=\"row lv_row\"><td class=\"col-xs-12 text-center\">";
            $rootScope.quiz.question[q].html_feedback += ("success"==tmpClass) ? $rootScope.quiz.question[q].feedback_for_correct : $rootScope.quiz.question[q].feedback_for_incorrect;
            $rootScope.quiz.question[q].html_feedback += "</td></tr></tbody></table>";
          }
          else {

            for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
            {
              if ( ($rootScope.quiz.question[q].selected_answer==$rootScope.quiz.question[q].options.option[k].text) && ($rootScope.quiz.question[q].options.option[k].feedback!=="")) {

                if ("DropDownList" == $rootScope.quiz.question[q].type || "VideoDropDownList" == $rootScope.quiz.question[q].type) {
                  $rootScope.quiz.question[q].html_feedback +=
                  "<tr class=\"row lv_row\">"+
                  "<td class=\"col-xs-3 text-center\" style=\"vertical-align: middle;\">"+
                  $rootScope.quiz.question[q].options.option[k].text+
                  "</td>"+
                  "<td class=\"col-xs-9 text-center\" style=\"vertical-align: middle;\">"+
                  $rootScope.quiz.question[q].options.option[k].feedback+
                  "</td>"+
                  "</tr>";
                }
                else{
                  $rootScope.quiz.question[q].html_feedback +=
                  "<tr class=\"row lv_row\">"+
                  "<td class=\"col-xs-3 text-center\" style=\"vertical-align: middle;\">"+
                  "<span mathjax-bind=\"quiz.question["+q+"].options.option["+k+"].html\"></span>"+
                  "</td>"+
                  "<td class=\"col-xs-9 text-center\" style=\"vertical-align: middle;\">"+
                  $rootScope.quiz.question[q].options.option[k].feedback+
                  "</td>"+
                  "</tr>";
                }

                break;

              }
            }
          }

        }
      }

      if($rootScope.quiz.question[q].html_feedback!=="" && "Number"!==$rootScope.quiz.question[q].type){
        $rootScope.quiz.question[q].html_feedback=
        "<table class=\"table\">"+
        "<thead>"+
        "<tr class=\"row lv_row\">"+
        "<th class=\"col-xs-3 text-center\">"+
        "OPCIÓN"+
        "</th>"+
        "<th class=\"col-xs-9 text-center\">"+
        "DESCRIPCIÓN"+
        "</th>"+
        "</tr>"+
        "</thead>"+

        "<tbody>"+
        $rootScope.quiz.question[q].html_feedback+
        "</tbody>"+
        "</table>";
      }

    }

  }

  /**********************************TRY AGAIN*****************************************************/
  $scope.TryAgain=function()
  {
    $rootScope.current_template = 'resources/html/quiz.html';
  };

  $('#lv_collapse_results').on('shown.bs.collapse', function () {
    $("#lv_table_wrap").scrollTop(0);
    $scope.title_accordion = "Ocultar resultado de cada pregunta";
    $scope.$apply();
  });

  $('#lv_collapse_results').on('hidden.bs.collapse', function () {
    $scope.title_accordion = "Ver resultado de cada pregunta";
    $scope.$apply();
  });


  EvaluationAnswers();


});
