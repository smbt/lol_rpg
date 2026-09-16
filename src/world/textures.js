export const textures = {

    grass: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
   <!-- Basis-Wiese (Mittleres Grün) -->
    <rect x="0" y="0" width="8" height="8" fill="#00c921"/>
    
    <!-- Dunkle Schatten-Punkte (Bringen Tiefe zwischen die Halme) -->
    <rect x="0" y="2" width="1" height="1" fill="#1dad35"/>
    <rect x="3" y="0" width="1" height="1" fill="#1dad35"/>
    <rect x="5" y="4" width="1" height="1" fill="#1dad35"/>
    <rect x="2" y="7" width="1" height="1" fill="#1dad35"/>
    <rect x="7" y="6" width="1" height="1" fill="#1dad35"/>

    <!-- Helle Halm-Spitzen (Simulieren Licht auf den Grashalmen) -->
    <rect x="1" y="1" width="1" height="2" fill="#26e344"/>
    <rect x="4" y="0" width="1" height="1" fill="#26e344"/>
    <rect x="3" y="4" width="2" height="1" fill="#26e344"/>
    <rect x="6" y="3" width="1" height="2" fill="#26e344"/>
    <rect x="1" y="6" width="2" height="1" fill="#26e344"/>
    <rect x="5" y="7" width="1" height="1" fill="#26e344"/>
</svg>`),

    wall: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Fels-Hintergrund (Mittleres Naturstein-Braun) -->
    <rect x="0" y="0" width="8" height="8" fill="#443b1a"/>
    
    <!-- Tiefen & Risse (Dunkle Schatten für unregelmäßige Steinkanten) -->
    <rect x="1" y="2" width="2" height="1" fill="#241f0d"/>
    <rect x="3" y="1" width="1" height="3" fill="#241f0d"/>
    <rect x="5" y="4" width="3" height="1" fill="#241f0d"/>
    <rect x="4" y="5" width="1" height="2" fill="#241f0d"/>
    <rect x="0" y="6" width="3" height="1" fill="#241f0d"/>
    <rect x="6" y="0" width="1" height="2" fill="#241f0d"/>

    <!-- Stein-Wölbungen (Helle Akzente, die wie hervorstehende Felsen wirken) -->
    <rect x="1" y="0" width="2" height="1" fill="#5e5225"/>
    <rect x="0" y="1" width="1" height="2" fill="#5e5225"/>
    <rect x="4" y="2" width="2" height="2" fill="#5e5225"/>
    <rect x="1" y="4" width="3" height="1" fill="#5e5225"/>
    <rect x="2" y="5" width="1" height="1" fill="#5e5225"/>
    <rect x="5" y="6" width="2" height="1" fill="#5e5225"/>
</svg>`),


    tree: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Baumkrone oben (Helles Grün) -->
    <rect x="3" y="1" width="2" height="2" fill="#15803d"/>
    <!-- Mittlerer Stamm/Blätter (Kräftiges Grün) -->
    <rect x="2" y="3" width="4" height="2" fill="#166534"/>
    <!-- Breite Basis unten (Dunkles Tannen-Grün) -->
    <rect x="1" y="5" width="6" height="2" fill="#14532d"/>
    <!-- Der sichtbare Stamm ganz unten (Holz-Braun) -->
    <rect x="3" y="7" width="2" height="1" fill="#78350f"/>
    <!-- Schattenwurf auf den Stamm (Dunkelbraun) -->
    <rect x="3" y="7" width="1" height="1" fill="#451a03"/>
</svg>`),


    house: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Basis-Mauerwerk (Sattes Dunkelgrau) -->
    <rect x="0" y="0" width="8" height="8" fill="#4b5563"/>
    
    <!-- Tiefen & Fugen (Sehr dunkles Anthrazit) -->
    <rect x="0" y="3" width="8" height="1" fill="#1f2937"/>
    <rect x="4" y="0" width="1" height="3" fill="#1f2937"/>
    <rect x="2" y="4" width="1" height="4" fill="#1f2937"/>
    
    <!-- Highlights / Kanten (Mittleres Grau für den 3D-Effekt) -->
    <rect x="0" y="0" width="8" height="1" fill="#6b7280"/>
    <rect x="0" y="4" width="8" height="1" fill="#6b7280"/>
</svg>`),


    chest: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Schwarzer Außenrahmen für den knackigen Retro-Look -->
    <rect x="0" y="0" width="8" height="8" fill="#472c19"/>
    
    <!-- Roter Samt/Holz-Korpus (Zentrum der Kiste) -->
    <rect x="2" y="1" width="4" height="3" fill="#b91c1c"/> <!-- Helles Rot oben -->
    <rect x="2" y="4" width="4" height="3" fill="#7f1d1d"/> <!-- Dunkles Rot unten -->
    <rect x="3" y="1" width="1" height="6" fill="#991b1b"/> <!-- Mittlerer Schatten-Streifen -->

    <!-- Goldene Beschläge links und rechts -->
    <rect x="1" y="1" width="1" height="6" fill="#d97706"/> <!-- Warmes Gold -->
    <rect x="6" y="1" width="1" height="6" fill="#b45309"/> <!-- Dunkleres Gold rechts (Schatten) -->
    
    <!-- Horizontale goldene Zierleiste (Trennlinie Deckel/Boden) -->
    <rect x="1" y="3" width="6" height="1" fill="#f59e0b"/> <!-- Glänzendes Gold -->
    
    <!-- Großes goldenes Schloss in der Mitte -->
    <rect x="3" y="3" width="2" height="2" fill="#fbbf24"/> <!-- Schloss-Platte -->
    <rect x="4" y="4" width="1" height="1" fill="#1c1917"/> <!-- Schlüsselloch -->
</svg>`),



}
