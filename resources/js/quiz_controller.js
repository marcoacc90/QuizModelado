app.controller('QuizController',function($scope, $rootScope, $http, $sce, $window, $timeout){

  $scope.hide_pbefore = true;
  $scope.hide_pafter = false;
  $scope.hide_maxpbefore = true;
  $scope.hide_maxpafter = true;
  $scope.visualizer = {
    'state': false,
    'image': ""
  };
  $scope.app_error = {'state': false, 'message': ""};
  $scope.current_question = {};
  $scope.number_pattern = /^-?\d*(\.?\d+)$/;

  $scope.quiz_submit = {state: false};
  var status_evaluated = false;


  /**********************************LOAD QUIZ*****************************************************/
  function LoadQuiz()
  {
    if($rootScope.quiz_original_data.quiz.questions.question.length > 0)
    {
      if($rootScope.quiz_original_data.quiz.questions_to_show > 0)
      {
        if($rootScope.quiz_original_data.quiz.questions_to_show <= $rootScope.quiz_original_data.quiz.questions.question.length)
        {
          $rootScope.number_questions = angular.copy($rootScope.quiz_original_data.quiz.questions_to_show);
          $rootScope.quiz.title = angular.copy($rootScope.quiz_original_data.quiz.title);
          $rootScope.quiz.question = [];
          var quiz_database;

          if(1 == $rootScope.quiz_original_data.quiz.random_mode)
          {
            var tmpObj = angular.copy($rootScope.quiz_original_data.quiz.questions.question);
            quiz_database = angular.copy(Shuffle(tmpObj));

            var n = angular.copy($rootScope.number_questions);

            while(n)
            {
              i = Math.floor(Math.random() * quiz_database.length);

              if (i in quiz_database)
              {
                $rootScope.quiz.question.push(quiz_database[i]);
                delete quiz_database[i];
                n--;
              }
            }
          }
          else
          {
            quiz_database=[];
            for(i=0; i<$rootScope.number_questions; i++)
            {
              quiz_database[i] = angular.copy($rootScope.quiz_original_data.quiz.questions.question[i]);
              $rootScope.quiz.question = angular.copy(quiz_database);
            }
          }
        }
        else
        {
          $scope.app_error.state=true;
          $scope.app_error.message="Error de configuración: El número de preguntas a mostrar es mayor que el número de preguntas disponibles en la base de datos";
          return false;
        }
      }
      else
      {
        $scope.app_error.state=true;
        $scope.app_error.message="Error de configuración: El número de preguntas a mostrar es menor o igual a cero";
        return false;
      }
    }
    else
    {
      $scope.app_error.state=true;
      $scope.app_error.message="Error de configuración: No se encontraron preguntas en la base de datos";
      return false;
    }


    for(i=0; i<$rootScope.number_questions; i++)
    {

      if ("Number"==$rootScope.quiz.question[i].type) {
        $rootScope.quiz.question[i].valid = false;
      }
      else {
        $rootScope.quiz.question[i].options.option = Shuffle($rootScope.quiz.question[i].options.option);
      }

      $rootScope.quiz.question[i].is_correct_answer=false;

      $rootScope.quiz.question[i].isVideoType = false;

      switch ($rootScope.quiz.question[i].type){

        case "Number":
        $rootScope.quiz.question[i].html_text_test="<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        $rootScope.quiz.question[i].selected_answer = "";

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml(
          "<form name=\"inputNumberForm"+i+"\" class=\"row\" novalidate autocomplete=\"off\">"+
          "<div class=\"lv_wrapper_options\">"+
          "<div class=\"col-xs-12 text-center\">"+
          "<input id=\"inputNumber"+i+"\" class=\"input-number\" type=\"text\" name=\"inputNumber"+i+"\" autocomplete=\"off\" ng-keydown=\"quiz_submit.state = false\" ng-keyup=\"quiz.question["+i+"].valid=inputNumberForm"+i+".$valid\" ng-model=\"quiz.question["+i+"].selected_answer\" ng-model-options=\"{allowInvalid: true}\" ng-pattern=\"number_pattern\"/>"+
          "</div>"+
          "<div class=\"col-xs-12 text-center\">"+
          "<div class=\"error-messages\" ng-messages=\"inputNumberForm"+i+".inputNumber"+i+".$error\" role=\"alert\" ng-if=\"quiz_submit.state\">"+
          "<div ng-message=\"pattern\">"+
          "<b>Ingresa una respuesta numérica<b>"+
          "</div>"+
          "</div>"+
          "</div>"+
          "</div>"+
          "</form>"
        );

        break;

        case "DropDownList":
        $rootScope.quiz.question[i].html_text_test = "<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result=$sce.trustAsHtml($rootScope.quiz.question[i].text.replace("_","________"));

        $rootScope.quiz.question[i].selected_answer = "";

        $rootScope.quiz.question[i].html_text_test=$sce.trustAsHtml($rootScope.quiz.question[i].html_text_test.replace("_",
        "<select ng-model=\"quiz.question["+i+"].selected_answer\">"+
        "<option value=\"\">__________</option>"+
        "<option ng-repeat=\"opt in quiz.question["+i+"].options.option\" value=\"{{opt.text}}\">{{opt.text}}</option>"+
        "</select>"));

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml('');

        break;

        case "RadioButton":
        $rootScope.quiz.question[i].html_text_test="<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        $rootScope.quiz.question[i].selected_answer = "";

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml(
          "<div class=\"lv_wrapper_options\">"+
          "<div ng-repeat=\"opt"+i+" in quiz.question["+i+"].options.option\" class=\"col-xs-12\">"+
          "<label class=\"col-xs-12 lv_answer_option input-group\">"+
          "<span class=\"input-group-addon lv_addon\" ng-class=\"{lv_addon_active: quiz.question["+i+"].selected_answer == '{{opt"+i+".text}}'}\">"+
          "<input type=\"radio\" autocomplete=\"off\" name=\"optradio_"+i+"\" ng-model=\"quiz.question["+i+"].selected_answer\" value=\"{{opt"+i+".text}}\"/>"+
          "</span>"+
          "<span mathjax-bind=\"opt"+i+".html\"></span>"+
          "</label>"+
          "</div>"+
          "</div>"
        );

        break;

        case "ImageRadioButton":
        $rootScope.quiz.question[i].html_text_test="<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        $rootScope.quiz.question[i].selected_answer = "";

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml(
          "<div class=\"lv_wrapper_options col-xs-12 col-sm-6 col-md-6\">"+
          "<div ng-repeat=\"opt"+i+" in quiz.question["+i+"].options.option\" class=\"col-xs-6 lv_wrapper_optimage\">"+
          "<label style=\"padding-bottom:0px !important; margin:0px !important;\" class=\"col-xs-12 lv_answer_option input-group\">"+

          "<input id=\"optradio_"+i+"{{$index}}\" class=\"imgoptchk\" type=\"radio\" autocomplete=\"off\" name=\"optradio_"+i+"\" ng-model=\"quiz.question["+i+"].selected_answer\" value=\"{{opt"+i+".src}}\"/>"+

          "<label class=\"imgchk\" for=\"optradio_"+i+"{{$index}}\">"+

          "<img id=\"img_"+i+"{{$index}}\" style=\"cursor:pointer; margin:0px !important; padding:0px !important;\" ng-src=\"{{opt"+i+".src}}\" class=\"img-responsive col-xs-12\" alt=\"\" ng-mouseover=\"ZoomVisualizer(true,opt"+i+".src);\" ng-mouseleave=\"ZoomVisualizer(false,opt"+i+".src);\">"+

          "</label>"+
          "</label>"+
          "</div>"+
          "</div>"+

          "<div class=\"lv_wrapper_options hidden-xs col-sm-6\" ng-show=\"visualizer.state\" style=\"margin-top:15px;\">"+
          "<div id=\"lv_zoom_visualizer\">"+
          "<img style=\"padding:4px;\" ng-src=\"{{visualizer.image}}\" class=\"img-responsive\" alt=\"\">"+
          "</div>"+
          "</div>"
        );

        break;

        case "CheckBox":
        $rootScope.quiz.question[i].html_text_test="<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        for(k=0; k<$rootScope.quiz.question[i].options.option.length; k++)
        {
          $rootScope.quiz.question[i].options.option[k].selected=0;
        }

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml(
          "<div class=\"lv_wrapper_options\">"+
          "<div ng-repeat=\"(index_chk"+i+", chk"+i+") in quiz.question["+i+"].options.option\" class=\"col-xs-12\">"+
          "<label class=\"col-xs-12 lv_answer_option input-group\">"+
          "<span class=\"input-group-addon lv_addon\" ng-class=\"{lv_addon_active: 1==quiz.question["+i+"].options.option[index_chk"+i+"].selected}\">"+
          "<input type=\"checkbox\" autocomplete=\"off\" name=\"optchk_"+i+"\"  ng-model=\"quiz.question["+i+"].options.option[index_chk"+i+"].selected\" ng-true-value=1 ng-false-value=0>"+
          "</span>"+
          "<span mathjax-bind=\"chk"+i+".html\"></span>"+
          "<label\">"+
          "</div>"+
          "</div>"
        );

        break;

        case "ImageCheckBox":
        $rootScope.quiz.question[i].html_text_test="<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        for(k=0; k<$rootScope.quiz.question[i].options.option.length; k++)
        {
          $rootScope.quiz.question[i].options.option[k].selected=0;
        }

        $rootScope.quiz.question[i].html_text_options=$sce.trustAsHtml(
          "<div class=\"lv_wrapper_options col-xs-12 col-sm-6 col-md-6\">"+
          "<div ng-repeat=\"(index_chk"+i+", chk"+i+") in quiz.question["+i+"].options.option\" class=\"col-xs-6 lv_wrapper_optimage\">"+
          "<label style=\"padding-bottom:0px !important; margin:0px !important;\" class=\"col-xs-12 lv_answer_option input-group\">"+

          "<input class=\"imgoptchk\" type=\"checkbox\" autocomplete=\"off\" id=\"imgoptchk_"+i+"{{index_chk"+i+"}}\"  ng-model=\"quiz.question["+i+"].options.option[index_chk"+i+"].selected\" ng-true-value=1 ng-false-value=0>"+

          "<label class=\"imgchk\" for=\"imgoptchk_"+i+"{{index_chk"+i+"}}\">"+

          "<img id=\"img_"+i+"{{index_chk"+i+"}}\" style=\"cursor:pointer; margin:0px !important; padding:0px !important;\" ng-src=\"{{chk"+i+".src}}\" class=\"img-responsive col-xs-12\" alt=\"\" ng-mouseover=\"ZoomVisualizer(true,chk"+i+".src);\" ng-mouseleave=\"ZoomVisualizer(false,chk"+i+".src);\">"+

          "<label\">"+

          "<label\">"+

          "</div>"+
          "</div>"+
          "<div class=\"lv_wrapper_options hidden-xs col-sm-6\" ng-show=\"visualizer.state\" style=\"margin-top:15px;\">"+
          "<div id=\"lv_zoom_visualizer\">"+
          "<img style=\"padding:4px;\" ng-src=\"{{visualizer.image}}\" class=\"img-responsive\" alt=\"\">"+
          "</div>"+
          "</div>"
        );

        break;

        case "VideoRadioButton":

        $rootScope.quiz.question[i].isVideoType = true;
        $rootScope.quiz.question[i].url = $sce.trustAsResourceUrl($rootScope.quiz.question[i].url+'?rel=0&autoplay=1');
        $rootScope.quiz.question[i].html_text_test=$sce.trustAsHtml(
          "<div class=\"row lv_row flex-parent\">"+
          "<div class=\"col-md-6\">"+
          "<div class=\"embed-responsive embed-responsive-16by9  lv_question_text\">"+
          "<iframe class=\"embed-responsive-item\" allowfullscreen ng-src=\"{{quiz.question["+i+"].url}}\"></iframe>"+
          "</div>"+
          "</div>"+

          "<div class=\"col-md-6 flex-child\">"+

          "<div class=\"lv_question_text\">"+
          "<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>"+
          "</div>"+

          "<div class=\"lv_wrapper_options\">"+
          "<div ng-repeat=\"opt"+i+" in quiz.question["+i+"].options.option\" class=\"col-xs-12\">"+
          "<label class=\"col-xs-12 lv_answer_option input-group\">"+
          "<span class=\"input-group-addon lv_addon\" ng-class=\"{lv_addon_active: quiz.question["+i+"].selected_answer == '{{opt"+i+".text}}'}\">"+
          "<input type=\"radio\" autocomplete=\"off\" name=\"optradio_"+i+"\" ng-model=\"quiz.question["+i+"].selected_answer\" value=\"{{opt"+i+".text}}\"/>"+
          "</span>"+
          "<span mathjax-bind=\"opt"+i+".html\"></span>"+
          "</label>"+
          "</div>"+
          "</div>"+

          "</div>"+
          "</div>"
        );

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);
        $rootScope.quiz.question[i].selected_answer = "";
        $rootScope.quiz.question[i].html_text_options="";

        break;

        case "VideoDropDownList":

        $rootScope.quiz.question[i].isVideoType = true;
        $rootScope.quiz.question[i].url = $sce.trustAsResourceUrl($rootScope.quiz.question[i].url+'?rel=0&autoplay=1');

        $rootScope.quiz.question[i].html_text_test = "<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>";
        $rootScope.quiz.question[i].html_text_test = $rootScope.quiz.question[i].html_text_test.replace("_",
        "<select ng-model=\"quiz.question["+i+"].selected_answer\">"+
        "<option value=\"\">__________</option>"+
        "<option ng-repeat=\"opt in quiz.question["+i+"].options.option\" value=\"{{opt.text}}\">{{opt.text}}</option>"+
        "</select>");

        $rootScope.quiz.question[i].html_text_test = $sce.trustAsHtml(
          "<div class=\"row lv_row flex-parent\">"+
          "<div class=\"col-md-6\">"+
          "<div class=\"embed-responsive embed-responsive-16by9  lv_question_text\">"+
          "<iframe class=\"embed-responsive-item\" allowfullscreen ng-src=\"{{quiz.question["+i+"].url}}\"></iframe>"+
          "</div>"+
          "</div>"+

          "<div class=\"col-md-6 flex-child\">"+
          "<div class=\"lv_question_text\">"+
          $rootScope.quiz.question[i].html_text_test+
          "</div>"+
          "</div>"+
          "</div>"
        );

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text.replace("_","________"));
        $rootScope.quiz.question[i].selected_answer = "";
        $rootScope.quiz.question[i].html_text_options = "";

        break;


        case "VideoCheckBox":

        $rootScope.quiz.question[i].isVideoType = true;
        $rootScope.quiz.question[i].url = $sce.trustAsResourceUrl($rootScope.quiz.question[i].url+'?rel=0&autoplay=1');

        $rootScope.quiz.question[i].html_text_test=$sce.trustAsHtml(
          "<div class=\"row lv_row flex-parent\">"+
          "<div class=\"col-md-6\">"+
          "<div class=\"embed-responsive embed-responsive-16by9  lv_question_text\">"+
          "<iframe class=\"embed-responsive-item\" allowfullscreen ng-src=\"{{quiz.question["+i+"].url}}\"></iframe>"+
          "</div>"+
          "</div>"+

          "<div class=\"col-md-6 flex-child\">"+

          "<div class=\"lv_question_text\">"+
          "<b>"+(i+1)+". "+$rootScope.quiz.question[i].text+"</b>"+
          "</div>"+

          "<div class=\"lv_wrapper_options\">"+
          "<div ng-repeat=\"(index_chk"+i+", chk"+i+") in quiz.question["+i+"].options.option\" class=\"col-xs-12\">"+
          "<label class=\"col-xs-12 lv_answer_option input-group\">"+
          "<span class=\"input-group-addon lv_addon\" ng-class=\"{lv_addon_active: 1==quiz.question["+i+"].options.option[index_chk"+i+"].selected}\">"+
          "<input type=\"checkbox\" autocomplete=\"off\" name=\"optchk_"+i+"\"  ng-model=\"quiz.question["+i+"].options.option[index_chk"+i+"].selected\" ng-true-value=1 ng-false-value=0>"+
          "</span>"+
          "<span mathjax-bind=\"chk"+i+".html\"></span>"+
          "<label\">"+
          "</div>"+
          "</div>"+

          "</div>"+
          "</div>"
        );

        $rootScope.quiz.question[i].html_text_result = $sce.trustAsHtml($rootScope.quiz.question[i].text);

        for(k=0; k<$rootScope.quiz.question[i].options.option.length; k++)
        {
          $rootScope.quiz.question[i].options.option[k].selected=0;
        }

        $rootScope.quiz.question[i].html_text_options="";

        break;


        default:
        break;
      }

    }

    $scope.current_question.number = 0;
    $scope.current_question.instruction = $rootScope.quiz.question[0].instruction;
    $scope.current_question.q = $rootScope.quiz.question[0].html_text_test;
    $scope.current_question.options = $rootScope.quiz.question[0].html_text_options;
    $scope.current_question.isVideoType = $rootScope.quiz.question[0].isVideoType;
  }



  /***********************************ZOOM VISUALIZER********************************************************/
  $scope.ZoomVisualizer = function(current_state, src)
  {
    $scope.visualizer.state = current_state;
    $scope.visualizer.image = src;
  };

  /***********************************SHUFFLE FUNCTION*******************************************************/
  function Shuffle(array)
  {
    var m = array.length, t, i;

    while(m)
    {
      i = Math.floor(Math.random() * m--);

      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }


  /**********************************CHANGE CURRENT QUESTION*****************************************************/
  $scope.ChangeCurrentQuestion = function(question_number)
  {

    $scope.hide_pbefore = false;
    $scope.hide_pafter = false;
    var pmin=0;

    if(question_number < 1)
    {
      $scope.hide_pbefore=true;
    }

    if(question_number > $rootScope.number_questions-2)
    {
      $scope.hide_pafter=true;
    }

    if(0<=question_number && $rootScope.number_questions>question_number)
    {
      $scope.current_question.number = question_number;
      $scope.current_question.instruction = $rootScope.quiz.question[question_number].instruction;
      $scope.current_question.q = $rootScope.quiz.question[question_number].html_text_test;
      $scope.current_question.options = $rootScope.quiz.question[question_number].html_text_options;
      $scope.current_question.isVideoType = $rootScope.quiz.question[question_number].isVideoType;

      $('.link_pages').removeClass('active');
      $('#page_'+question_number).addClass('active');


      if($rootScope.number_questions>10)
      {
        $('.link_pages').removeClass('lv_pag_elements');

        if( question_number < 4)
        {
          pmin=0;
          $scope.hide_maxpbefore = true;
          $scope.hide_maxpafter = false;
        }
        else
        {
          $scope.hide_maxpbefore = false;

          if ( question_number > $rootScope.number_questions-5 )
          {
            pmin=$rootScope.number_questions-7;
            $scope.hide_maxpafter = true;
          }
          else
          {
            pmin=question_number-3;
            pmax=question_number+4;
            $scope.hide_maxpafter = false;
          }

        }

        for(p = pmin; p < pmin+7; p++)
        {
          $('#page_'+p).addClass('lv_pag_elements');
        }

      }

      if(true===status_evaluated)
      {
        $('#pregunta').removeClass('lv_empty_answer');

        var empty_answers = CheckAnswers();

        for(e=0;e<empty_answers.length;e++)
        {
          if(question_number===empty_answers[e])
          {
            $('#pregunta').addClass('lv_empty_answer');
            break;
          }
        }
      }

      $(window).scrollTop($(".lv_title_quiz").offset().top);
    }
  };


  /**********************************SUBMIT ANSWERS FOR QUESTIONS*****************************************************/
  $scope.SubmitAnswers = function()
  {
    $scope.quiz_submit.state = true;
    status_evaluated = true;

    var empty_answers = CheckAnswers();

    if(empty_answers.length>0)
    {
      $scope.ChangeCurrentQuestion(empty_answers[0]);
    }
    else
    {
      $rootScope.current_template = 'resources/html/quiz_results.html';
    }

  };

  /**********************************CHECK ANSWERS FOR QUESTIONS*****************************************************/
  var CheckAnswers = function()
  {
    $('.link_pages').removeClass('lv_empty');

    var answer_state=false;
    var empty_answers = [];

    for(q=0; q<$rootScope.number_questions; q++)
    {

      if("CheckBox"==$rootScope.quiz.question[q].type || "ImageCheckBox"==$rootScope.quiz.question[q].type || "VideoCheckBox"==$rootScope.quiz.question[q].type)
      {
        answer_state = false;
        for(k=0; k<$rootScope.quiz.question[q].options.option.length; k++)
        {
          answer_state=answer_state || (1 == $rootScope.quiz.question[q].options.option[k].selected);
          if(true === answer_state)
          {
            break;
          }
        }
      }
      else
      {

        if($rootScope.quiz.question[q].selected_answer.length > 0)
        {
          if ("Number"==$rootScope.quiz.question[q].type) {
            answer_state=$rootScope.quiz.question[q].valid;
          }
          else {
            answer_state=true;
          }

        }
        else{
          answer_state=false;
        }

      }

      if(false === answer_state)
      {
        empty_answers.push(q);
        $('#page_'+q).addClass('lv_empty');
      }

    }

    return empty_answers;

  };

  LoadQuiz();

  var waitForRender = function()
  {
    if($http.pendingRequests.length > 0)
    {
      $timeout(waitForRender); // Wait for all templates to be loaded
    }
    else
    {
      if($rootScope.number_questions>10)
      {
        $scope.hide_maxpafter = false;
        $('#page_7').removeClass('lv_pag_elements');
        $('#page_8').removeClass('lv_pag_elements');
        $('#page_9').removeClass('lv_pag_elements');
      }
    }
  };

  $timeout(waitForRender);

});
