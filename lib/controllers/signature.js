'use strict';

var mongoose = require('mongoose'),
   UserChars = mongoose.model('UserChars'),
   Character = mongoose.model('Character'),
   User = mongoose.model('User');


exports.buildSig = function(req, res) {
  var id = req.params.id;

  res.writeHead(200, {'Content-Type': 'text/html'});

  findUser(id)
    .then(function(user) {

      findUserCharAndPopulate(user)
        .then(function(userchar) {

          var charInfo = buildCharInfo(userchar);
          res.end(buildCharSig(charInfo), 'utf-8');

        }, function(err) {
          res.end(buildBlankSig(), 'utf-8');
        });




    }, function(err) {
      res.end(buildBlankSig(), 'utf-8');
    });






  //var html = 'test';

  //res.end(html, 'utf-8');
};


function buildBlankSig() {

  var html =
    '<table>' +
      '<thead>' +
        '<tr>' +
          '<th></th>' +
          '<th align="right">Kills</th>' +
          '<th align="right">Deaths</th>' +
          '<th align="right">RR</th>' +
          '<th align="right">RP</th>' +
          '<th align="right">IRS</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr style="color: red">' +
          '<td>Albion:</td>' +
          '<td align="right">{{ totals.alb.kills | number: 0 }}</td>' +
          '<td align="right">{{ totals.alb.deaths | number: 0 }}</td>' +
          '<td align="right">{{ totals.alb.rr.rankStr }}</td>' +
          '<td align="right">{{ totals.alb.rp | number: 0 }}</td>' +
          '<td align="right">{{ totals.alb.irs | number: 2 }}</td>' +
        '</tr>' +
        /*<tr class="hibernia">
          <td>Hibernia:</td>
          <td align="right">{{ totals.hib.kills | number: 0 }}</td>
          <td align="right">{{ totals.hib.deaths | number: 0 }}</td>
          <td align="right">{{ totals.hib.rr.rankStr }}</td>
          <td align="right">{{ totals.hib.rp | number: 0 }}</td>
          <td align="right">{{ totals.hib.irs | number: 2 }}</td>
        </tr>
        <tr class="midgard">
          <td>Midgard:</td>
          <td align="right">{{ totals.mid.kills | number: 0 }}</td>
          <td align="right">{{ totals.mid.deaths | number: 0 }}</td>
          <td align="right">{{ totals.mid.rr.rankStr }}</td>
          <td align="right">{{ totals.mid.rp | number: 0 }}</td>
          <td align="right">{{ totals.mid.irs | number: 2 }}</td>
        </tr>*/
      '</tbody>' +
      /*<tfoot>
        <tr class="overall">
          <th>Total:</th>
          <th class="total_header">{{ totals.overall.kills | number: 0 }}</th>
          <th class="total_header">{{ totals.overall.deaths | number: 0 }}</th>
          <th class="total_header">{{ totals.overall.rr.rankStr }}</th>
          <th class="total_header">{{ totals.overall.rp | number: 0 }}</th>
          <th class="total_header">{{ totals.overall.irs | number: 2 }}</th>
        </tr>
      </tfoot>*/
    '</table>';


  return html;

}


function buildCharSig(charInfo) {

  var html =
    '<p>' + charInfo.name + '</p>' +
    '<table>' +
      '<thead>' +
        '<tr>' +
          '<th></th>' +
          '<th align="right">RP</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        '<tr style="color: red">' +
          '<td>Albion:</td>' +
          '<td align="right">' + charInfo.totals.alb + '</td>' +
        '</tr>' +
    /*<tr class="hibernia">
     <td>Hibernia:</td>
     <td align="right">{{ totals.hib.kills | number: 0 }}</td>
     <td align="right">{{ totals.hib.deaths | number: 0 }}</td>
     <td align="right">{{ totals.hib.rr.rankStr }}</td>
     <td align="right">{{ totals.hib.rp | number: 0 }}</td>
     <td align="right">{{ totals.hib.irs | number: 2 }}</td>
     </tr>
     <tr class="midgard">
     <td>Midgard:</td>
     <td align="right">{{ totals.mid.kills | number: 0 }}</td>
     <td align="right">{{ totals.mid.deaths | number: 0 }}</td>
     <td align="right">{{ totals.mid.rr.rankStr }}</td>
     <td align="right">{{ totals.mid.rp | number: 0 }}</td>
     <td align="right">{{ totals.mid.irs | number: 2 }}</td>
     </tr>*/
      '</tbody>' +
    /*<tfoot>
     <tr class="overall">
     <th>Total:</th>
     <th class="total_header">{{ totals.overall.kills | number: 0 }}</th>
     <th class="total_header">{{ totals.overall.deaths | number: 0 }}</th>
     <th class="total_header">{{ totals.overall.rr.rankStr }}</th>
     <th class="total_header">{{ totals.overall.rp | number: 0 }}</th>
     <th class="total_header">{{ totals.overall.irs | number: 2 }}</th>
     </tr>
     </tfoot>*/
    '</table>';


  console.log(html);
  return html;

}

function findUser(id) {
  var response = User
    .findOne({name: id})
    .exec();

  return response.then( function(user) {
    if( !user) {
      throw Exception('User not found');
    }

    return user;
  });
}


function findUserCharAndPopulate(user) {
  var response = UserChars
    .findOne({ _user: user._id })
    .populate('_chars')
    .populate('_user', 'name email')
    .exec();

  return response.then( function( userchar) {
    return userchar;
  });

}


function buildCharInfo(userchar) {

  var charInfo = {};

  charInfo.name = userchar._user.name;

  var albTotal = 0;
  var hibTotal = 0;
  var midTotal = 0;
  for(var i = 0; i < userchar._chars.length; i++) {

    switch (userchar._chars[i].realm) {
      case 1:
        albTotal += userchar._chars[i].realm_war_stats.current.realm_points;
        break;
      case 2:
        midTotal += userchar._chars[i].realm_war_stats.current.realm_points;
        break;
      case 3:
        hibTotal += userchar._chars[i].realm_war_stats.current.realm_points;
        break;
    }
  }

  charInfo.totals = {};
  charInfo.totals.alb = albTotal;
  charInfo.totals.mid = midTotal;
  charInfo.totals.hib = hibTotal;

  return charInfo;
}