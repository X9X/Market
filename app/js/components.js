// function GoodsListController($scope, $element, $attrs) {
//   var ctrl = this;

//   // This would be loaded by $http etc.
//   ctrl.list = [
//     {
//       name: 'Superman',
//       location: ''
//     },
//     {
//       name: 'Batman',
//       location: 'Wayne Manor'
//     }
//   ];

//   ctrl.updateHero = function(hero, prop, value) {
//     hero[prop] = value;
//   };

//   ctrl.deleteHero = function(hero) {
//     var idx = ctrl.list.indexOf(hero);
//     if (idx >= 0) {
//       ctrl.list.splice(idx, 1);
//     }
//   };
// }
var marketComponents = angular.module('marketComponents', []);
marketComponents.component('goodsList', {
  templateUrl: 'goodsList.html',
  controller: GoodsListController
});
var mode = angular.module('heroApp', []);

function HeroDetailController($scope, $element, $attrs) {
  var ctrl = this;

  ctrl.update = function(prop, value) {
    ctrl.onUpdate({hero: ctrl.hero, prop: prop, value: value});
  };
}

angular.module('heroApp').component('heroDetail', {
  templateUrl: 'heroDetail.html',
  controller: HeroDetailController,
  bindings: {
    hero: '<',
    onDelete: '&',
    onUpdate: '&'
  }
});

function EditableFieldController($scope, $element, $attrs) {
  var ctrl = this;
  ctrl.editMode = false;

  ctrl.handleModeChange = function() {
    if (ctrl.editMode) {
      ctrl.onUpdate({value: ctrl.fieldValue});
      ctrl.fieldValueCopy = ctrl.fieldValue;
    }
    ctrl.editMode = !ctrl.editMode;
  };

  ctrl.reset = function() {
    ctrl.fieldValue = ctrl.fieldValueCopy;
  };

  ctrl.$onInit = function() {
    // Make a copy of the initial value to be able to reset it later
    ctrl.fieldValueCopy = ctrl.fieldValue;

    // Set a default fieldType
    if (!ctrl.fieldType) {
      ctrl.fieldType = 'text';
    }
  };
}

angular.module('heroApp').component('editableField', {
  templateUrl: 'editableField.html',
  controller: EditableFieldController,
  bindings: {
    fieldValue: '<',
    fieldType: '@?',
    onUpdate: '&'
  }
});
