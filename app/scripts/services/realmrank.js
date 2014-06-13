(function () {
  'use strict';

angular.module('gimpchimpApp')
  .factory('RealmRanks', function ($rootScope) {

    var realmRanks = $rootScope.rRanks;

    return {

      getRR: function (rp) {

        var rankInfo = {};

        var finalRR = '';
        var nextRR = '';
        //var next = 0;
        var minor = '';

        var rankObj = _.find(realmRanks, function(realmRank) {
          return rp >= realmRank.min_rp && (!realmRank.max_rp || rp < realmRank.max_rp);
        });

        var major = rankObj.rank;

        // if rank 0 or rank 13 no need to find levels
        if( rankObj.rank === 0 || rankObj.rank === 13) {
          finalRR = rankObj.rank + 'L0';
          minor = 0;
        }
        // otherwise find the level
        else {

          // loop through the levels
          for (var i = rankObj.levels.length; i >= 0; i--) {
            if (rankObj.levels[i] <= rp ) {
              // if it's rank 1 then start with level 1
              if (rankObj.minor_rank_start) {
                i++;
              }
              finalRR = rankObj.rank + 'L' + (i);
              minor = i;
              break;
            }
          }

        }


        if( minor === 9 ) {
          var nextRRTotal = rankObj.max_rp + 1;

          rankObj = _.find(realmRanks, function(realmRank) {
            return nextRRTotal >= realmRank.min_rp && (!realmRank.max_rp || nextRRTotal < realmRank.max_rp);
          });

          nextRRTotal = rankObj.levels[0];
          nextRR = nextRRTotal - rp;

        } else if( major === 0 ) {
          nextRR = 1;
        } else if( major === 13) {
          nextRR = 0;
        } else {
          var nextRRTotal = rankObj.levels[minor + (major === 1 ? 0 : 1)];
          nextRR = nextRRTotal - rp;
        }

        rankInfo.rankStr = finalRR;
        rankInfo.nextRR = nextRR;

        return rankInfo;
      }



    }
  });

}());