(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('ShowCtrl', function ($scope, $http, $routeParams, REALM, $window, RealmRanks) {

    $scope.found = true;
    var resetTotals = function() {
      $scope.totals = {
        alb: {
          kills: 0,
          solo_kills: 0,
          deaths: 0,
          rp: 0,
          irs: 0
        },
        mid: {
          kills: 0,
          solo_kills: 0,
          deaths: 0,
          rp: 0,
          irs: 0
        },
        hib: {
          kills: 0,
          solo_kills: 0,
          deaths: 0,
          rp: 0,
          irs: 0
        },
        overall: {
          kills: 0,
          solo_kills: 0,
          deaths: 0,
          rp: 0,
          irs: 0
        }
      };
    };

    $scope.url = $window.location.href;

    $scope.sortCol = 'realm_war_stats.current.realm_points';
    $scope.order = true;

    $scope.retrieveCharacters = function(force) {
      $scope.showRefreshLink = false;
      resetTotals();
      if( force )
        var getUrl = '/api/characters/' + $routeParams.id + '?refresh=1';
      else
        var getUrl = '/api/characters/' + $routeParams.id;

      var momentNow = moment(new Date());

      $http.get(getUrl).success(function (userchars) {
        $scope.characters = userchars._chars;
        angular.forEach($scope.characters, function (char) {

          if( !$scope.showRefreshLink && momentNow.diff(moment(char.updated), 'hours', true) > 1) {
            $scope.showRefreshLink = true;
          }

          if(!char.guild_info){
            char.guild_info = {};
            char.guild_info.guild_name = '';
          }

          char.realm = REALM[char.realm];

          char.rr = RealmRanks.getRR(char.realm_war_stats.current.realm_points);

          var deaths = char.realm_war_stats.current.player_kills.total.deaths || 1;
          char.realm_war_stats.current.player_kills.total.irs = char.realm_war_stats.current.realm_points / deaths;

          switch (char.realm) {
            case 'Albion':
              $scope.totals.alb.kills += char.realm_war_stats.current.player_kills.total.kills;
              $scope.totals.alb.deaths += char.realm_war_stats.current.player_kills.total.deaths;
              $scope.totals.alb.solo_kills += char.realm_war_stats.current.player_kills.total.solo_kills;
              $scope.totals.alb.rp += char.realm_war_stats.current.realm_points;
              break;
            case 'Hibernia':
              $scope.totals.hib.kills += char.realm_war_stats.current.player_kills.total.kills;
              $scope.totals.hib.deaths += char.realm_war_stats.current.player_kills.total.deaths;
              $scope.totals.hib.solo_kills += char.realm_war_stats.current.player_kills.total.solo_kills;
              $scope.totals.hib.rp += char.realm_war_stats.current.realm_points;
              break;
            case 'Midgard':
              $scope.totals.mid.kills += char.realm_war_stats.current.player_kills.total.kills;
              $scope.totals.mid.deaths += char.realm_war_stats.current.player_kills.total.deaths;
              $scope.totals.mid.solo_kills += char.realm_war_stats.current.player_kills.total.solo_kills;
              $scope.totals.mid.rp += char.realm_war_stats.current.realm_points;
              break;
          }

          $scope.totals.overall.kills += char.realm_war_stats.current.player_kills.total.kills;
          $scope.totals.overall.deaths += char.realm_war_stats.current.player_kills.total.deaths;
          $scope.totals.overall.solo_kills += char.realm_war_stats.current.player_kills.total.solo_kills;
          $scope.totals.overall.rp += char.realm_war_stats.current.realm_points;


        });

        $scope.totals.alb.irs = $scope.totals.alb.rp / ($scope.totals.alb.deaths === 0 ? 1 : $scope.totals.alb.deaths);
        $scope.totals.hib.irs = $scope.totals.hib.rp / ($scope.totals.hib.deaths === 0 ? 1 : $scope.totals.hib.deaths);
        $scope.totals.mid.irs = $scope.totals.mid.rp / ($scope.totals.mid.deaths === 0 ? 1 : $scope.totals.mid.deaths);
        $scope.totals.overall.irs = $scope.totals.overall.rp / ($scope.totals.overall.deaths === 0 ? 1 : $scope.totals.overall.deaths);

        $scope.totals.alb.rr = RealmRanks.getRR($scope.totals.alb.rp);
        $scope.totals.hib.rr = RealmRanks.getRR($scope.totals.hib.rp);
        $scope.totals.mid.rr = RealmRanks.getRR($scope.totals.mid.rp);
        $scope.totals.overall.rr = RealmRanks.getRR($scope.totals.overall.rp);

        $scope.userName = userchars._user.name;
        $scope.updated = userchars.updated;

        $scope.found = true;
      })
        .error(function(err) {
          $scope.characters = [];
          $scope.found = false;
        });
    };

    $scope.deleteChar = function(id, idx) {
      var deleteUser = $window.confirm('Are you sure you want to remove this character?');

      if( deleteUser ) {
        $http.delete('/api/characters/' + $routeParams.id + '/' + id).success(function (res) {
          if (res === '200') {
            $scope.retrieveCharacters();
          }
        });
      }
    };

    $scope.isMid = function(char) {
      return char.realm === 'Midgard';
    };
    $scope.isHib = function(char) {
      return char.realm === 'Hibernia';
    };
    $scope.isAlb = function(char) {
      return char.realm === 'Albion';
    };

    $scope.sort = function(col) {

      if( $scope.sortCol === col || Array.isArray(col) && ($scope.sortCol[0] == col[0] ) ) {
        $scope.order = !$scope.order;
      } else {
        $scope.sortCol = col;
        $scope.order = false;
      }

    };


    $scope.forceRefresh = function() {
      delete $scope.characters;
      $scope.retrieveCharacters( true );
    };


  });

}());
