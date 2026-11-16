!function() {
  let mobile = (function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  })();
  document.body.style.overflow = 'hidden'
  document.write(`  <canvas id="gameCanvas"></canvas>
<div id="overlay1">
  <canvas id="hudCanvas"></canvas>
  <div id="tankName" class="bold">name</div>
  <div id="tankLevel" class="bold">Level 0 Node-Base</div>
  <div id="tankScore">
    <div id="tankScoreBar"></div>
    <div id="tankScoreDisplay" class="light">Score: 0</div>
  </div>
  <div id="tankPartialLevel">
    <div id="tankLevelBar"></div>
    <div id="tankLevelDisplay" class="light">0 / 100</div>
  </div>
  <div id="leaderboard">
    <div id="leaderboardTitle" class="bold">Leaderboard</div>
    <div id="leaderboardEntries"></div>
    <input id="chat" type="text" maxlength="100" autocomplete="off" spellcheck="false">
  </div>
  <div id="statUpgradesLeft">
    <div id="statDisplayLeft" class="bold">x0</div>
  </div>
  <div id="statUpgradesRight">
    <div id="statDisplayRight" class="bold">0x</div>
  </div>
  <div id="connecting">Connecting</div>
  <canvas id="mapCanvas" width="500" height="500"></canvas>
  <div id="mapInfo">
    <div id="coords" class="light"></div>
    <div id="debugSlide" class="light">
      <div id="debugText"></div>
    </div>
  </div>
  <div id="joystickLeft">
    <div id="joystickLeftInner"></div>
  </div>
  <div id="joystickRight">
    <div id="joystickRightInner"></div>
  </div>
</div>
<div id="overlay2">
  <div id="panel" class="panel">
    <div id="menuWipeBox"><div id="menuWipe"></div></div>
    <div id="menuButtons">
      <button id="b2" class="menuBtn menuBtnSecondary" onclick="window.clicked2&&window.clicked2(event)">Log in</button>
      <button id="b1" class="menuBtn menuBtnPrimary radiantBackground" onclick="window.clicked&&window.clicked(event)">Create Account</button>
    </div>
    <button id="discordButton" class="menuBtn" data-url="https://discord.gg/" onclick="window.open(this.dataset.url, '_blank', 'noopener')">Join Discord</button>
    <button id="githubButton" class="menuBtn" data-url="https://github.com/HamdanProfessional/opensource-scenexe" onclick="window.open(this.dataset.url, '_blank', 'noopener')">View on GitHub</button>
    <div id="title" class="radiantColor">Open-Scenexe</div>
    <div id="menuVersion"></div>
    <div id="changelog" class="light" style="visibility:hidden"></div>
    <div id="serverSelectTitle">Gamemode</div>
    <div id="serverSelect">
      <div id="serverSelectSlide" class="bold"><div id="serverSelectLeft">Connecting...</div><div id="serverSelectRight">Connecting...</div></div>
      <div id="serverSelectLower">
        <div id="serverSelectLowerText" class="bold">???</div>
      </div>
      <div id="serverSelectLeftOuter">
        <div id="serverSelectArrow" class="bold">&lt;</div>
      </div>
      <div id="serverSelectRightOuter">
        <div id="serverSelectArrow" class="bold">&gt;</div>
      </div>
    </div>
    <div id="connectingSmall">Connecting</div>
    <div id="playMenu" style="opacity:0;pointer-events:none;">
      <input id="name" type="text" placeholder="Display Name" maxlength="50">
      <button id="playButton">PLAY</button>
      <div id="tankMode">
        <button class="tankModeOption" data-mode="">Scenexe tank</button>
        <button class="tankModeOption" data-mode="arras">Arras tank</button>
      </div>
    </div>
    <div id="respawnText" class="light"></div>
  </div>
</div>
<div id="respawnPanel" style="top:-100%">
  <div id="deathCard">
    <div id="deathHead">
      <canvas id="respawnCanvas" width="750" height="750"></canvas>
      <div id="deathHeadText">
        <div id="respawnTitle">You died!</div>
        <div id="killer">you were killed by</div>
      </div>
    </div>
    <div id="deathStats"></div>
    <div id="deathSpectate"></div>
    <div id="deathRespawnAt"></div>
    <div id="deathButtons">
      <button id="respawnContinue" class="menuBtn radiantBackground">Respawn</button>
      <button id="deathMenu" class="menuBtn menuBtnSecondary">Menu</button>
    </div>
  </div>
</div>
<div id="modals" class="panel" style="pointer-events:none"><div style="pointer-events:all">
  <button id="howToPlay" class="menuBtn menuBtnSmall radiantBackground" onclick="page.openTips()">How To Play</button>
  <div id="tipsDark" class="panel"></div>
  <div id="tips">
    <div id="tipsTitle" class="light">Welcome to Open-Scenexe!</div>
    <hr style="width:1500px;margin-top:80px;">
    <div id="tipsContent" class="light">
      <div style="line-height: 140%;" class="radiantColor">Keybinds</div>
      <div style="line-height: 140%;">(E) Autofire - automatically shoots</div>
      <div style="line-height: 140%;">(C) Autospin - automatically spins</div>
      <div style="line-height: 140%;">(V) Passive Mode - disable/enable auras and turrets</div>
      <div style="line-height: 140%;">(X) Spin Lock - locks direction</div>
      <div style="line-height: 140%;">(M) Debug Mode - opens debug menu</div>
      <div style="line-height: 140%;">(N) Bullet Health Bars - show/hide bullet health bars</div>
      <div style="line-height: 140%;">(J) Screenshot - copy current view as base64</div>
      <div style="line-height: 140%;">(K) View Screenshot - view screenshot</div>
      <div style="line-height: 140%;">(Q) Show Coordinates - displays coordinates</div>
      <div style="line-height: 140%;">(R) Reverse Direction - reverses direction</div>
      <div style="line-height: 140%;">(H) Static Camera - turns off camera drag</div>
      <div style="line-height: 140%;">(Y) Weapon Tree - shows every weapon upgrade path</div>
      <div style="line-height: 140%;">(U) Body Tree - shows every body upgrade path</div>
      <div style="line-height: 140%;">(T) Quick Chat - send saved messages</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Controls</div>
      <div style="line-height: 140%;">Use the WASD keys or the arrow keys to move, and use the mouse to aim.</div>
      <div style="line-height: 140%;">Click to shoot.</div>
      <div style="line-height: 140%;">Press ENTER to chat.</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Polygons</div>
      <div style="line-height: 140%;">Polygons are passive entities you can kill to gain score.</div>
      <div style="line-height: 140%;">Polygons spawn with 3 to 13 sides. The more sides a polygons has, the more score it has.</div>
      <div style="line-height: 140%;">Bigger polygons spawn more in the center of the map.</div>
      <div style="line-height: 140%;">Sometimes polygons change colors, this means it is radiant, and it has 25x more score.</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Upgrades</div>
      <div style="line-height: 140%;">You can separately upgrade your weapon and body.</div>
      <div style="line-height: 140%;">Your weapon upgrade has barrels and turrets.</div>
      <div style="line-height: 140%;">Your body upgrade lets you move faster, have more health, damage enemies close to you, heal friends, and more.</div>
      <div style="line-height: 140%;">You can choose starter upgrades at level 1, and can upgrade further at level 15, 30, and 45.</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Tanks</div>
      <div style="line-height: 140%;">Every player controls a tank.</div>
      <div style="line-height: 140%;">There are 4 tank teams: Red, Blue, Green, and Purple.</div>
      <div style="line-height: 140%;">In FFA, there are no teams. Anyone who is red is an enemy.</div>
      <div style="line-height: 140%;">In 2teams, there are 2teams: Red and Blue.</div>
      <div style="line-height: 140%;">In 4teams, there are all 4 teams.</div>
      <div style="line-height: 140%;">All intermediate dimensions have 4 teams.</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Wormholes</div>
      <div style="line-height: 140%;">If you are level 60, you can enter wormholes.</div>
      <div style="line-height: 140%;">If the wormhole is white, it will turn anyone inside into a celestial and send them to the sanctuary.</div>
      <div style="line-height: 140%;">If the wormhole is white but has spikes coming out of it, this means it is ruptured. Any tank can enter a ruptured wormhole. It will send tanks inside to the crossroads.</div>
      <div style="line-height: 140%;">If the wormhole is ruptured but is red, purple, or green, this means it will send tanks to FFA, 2teams, and 4teams, respectively.</div>
      <hr>
      <div style="line-height: 140%;" class="radiantColor">Celestials</div>
      <div style="line-height: 140%;">Celestials are pink tanks that are triangles.</div>
      <div style="line-height: 140%;">You can become a celestial by entering a wormhole after reaching level 60.</div>
      <div style="line-height: 140%;">After ascending, you will become a celestial. Celestials have separate upgrades from tanks.</div>
      <div style="line-height: 140%;">All Celestials are on the same team, pink team.</div>
      <div style="line-height: 140%;">You can choose starter upgrades at level 75, and can upgrade further at level 90.</div>
      <hr>
      <div style="line-height: 140%;">Theres more to be found in this game, but we don't know yet.</div>
      <div style="line-height: 140%;">It's your job to find them!</div>
      <div style="line-height: 140%;">Click PLAY to start the game.</div>
    </div>
    <hr style="width:1500px;position:absolute;bottom:80px;left:50%;transform:translate(-50%,0);">
    <button id="tipsBack" class="menuBtn menuBtnSecondary">BACK</button>
  </div>
  <div id="contactDark" class="panel"></div>
  <div id="contact">
    <div id="contactTitle" class="light">Submit Feedback</div>
    <hr style="width:550px;margin-top:80px;">
    <div id="contactHeader" class="light">Feedback:</div>
    <textarea id="contactContent" maxlength="1000" placeholder="1000 character limit"></textarea>
    <hr style="width:550px;position:absolute;bottom:80px;left:50%;transform:translate(-50%,0);">
    <button id="contactSubmit" class="menuBtn radiantBackground">SUBMIT</button>
    <button id="contactCancel" class="menuBtn menuBtnSecondary">CANCEL</button>
  </div>
  <div id="changelogDark" class="panel"></div>
  <div id="changelogFull">
    <div id="changelogTitle" class="light">Changelog</div>
    <hr style="width:1500px;margin-top:80px;">
    <div id="changelogContent" class="light"></div>
    <hr style="width:1500px;position:absolute;bottom:80px;left:50%;transform:translate(-50%,0);">
    <button id="changelogBack" class="menuBtn menuBtnSecondary">BACK</button>
  </div>
  <div id="accountDark" class="panel"></div>
  <div id="accountFull">
    <div id="accountContent" class="light"></div>
    <hr style="width:1500px;position:absolute;bottom:80px;left:50%;transform:translate(-50%,0);">
    <button id="accountBack" class="menuBtn menuBtnSecondary">BACK</button>
  </div>
  <div id="authDark"></div>
  <form id="authForm" autocomplete="on">
    <div id="authTitle">Log in</div>
    <input id="authUser" class="authInput" name="username" type="text" placeholder="Username" maxlength="30" autocomplete="username" spellcheck="false">
    <input id="authPass" class="authInput" name="password" type="password" placeholder="Password" maxlength="30" autocomplete="current-password">
    <div id="authError"></div>
    <div id="authRow">
      <button id="authCancel" type="button" class="menuBtn menuBtnSmall menuBtnSecondary">Cancel</button>
      <button id="authSubmit" type="submit" class="menuBtn menuBtnSmall radiantBackground">Log in</button>
    </div>
    <div id="authSwitch"></div>
  </form>
  <div id="disconnectDark" class="panel"></div>
  <div id="disconnect">
    <div id="disconnectTitle" class="light">Disconnected</div>
    <div id="disconnectText" class="bold">An unexpected error occurred</div>
    <button id="disconnectReload" class="menuBtn radiantBackground">RELOAD</button>
  </div>
</div></div>
`)
