// Original editorial starting guidance, not simulated rankings or a tested BiS list.
export const specGuides = {
  warrior: [
    ['Make each weapon swing matter.', 'A deliberate melee style built around weapon damage, Rage, and controlling your next engagement.', 'Keep a suitable two-handed weapon current; avoid spending every point of Rage before an important ability.', 'Weapon quality, Strength, and enough Stamina to survive your pulls.'],
    ['Keep the pressure on.', 'Sustained melee aggression rewards reliable uptime and careful control of threat.', 'Build Rage safely, keep attacking from a safe position, and leave room for interrupts or defensives.', 'Weapons and melee accuracy matter; do not assume endgame dual-wield gearing applies at low levels.'],
    ['Set the pace of the pull.', 'Shield-based tanking combines threat, positioning, and damage reduction.', 'Establish threat on the whole pull; face enemies away from allies and use mitigation before spikes.', 'A current shield, survivability, and enough accuracy to make threat abilities connect.'],
  ],
  paladin: [
    ['Bring calm to the front line.', 'Armored healing blends efficient casts with powerful defensive support.', 'Match heal size to incoming damage; use blessings and emergency protection before a player is lost.', 'Healing effectiveness, Intellect, and Mana sustain; armor alone does not make an item a healing upgrade.'],
    ['Hold the line with the Light.', 'Tanking requires stable threat, a defensive setup, and a sustainable Mana budget.', 'Gather enemies where your group can fight safely; conserve enough Mana for the next pull.', 'A shield and defensive stats, then the resources and accuracy needed to hold threat.'],
    ['Turn conviction into pressure.', 'A melee damage path that still brings blessings, off-heals, and emergency protection.', 'Maintain melee uptime without ignoring utility; save resources for an emergency rather than chasing every hit.', 'Weapon damage, Strength, and survivability; compare items for your actual role.'],
  ],
  hunter: [
    ['Adventure with a loyal companion.', 'A pet-focused approach that rewards preparation and active companion control.', 'Keep your pet trained, establish pet threat, and separate pet attack from movement commands.', 'An up-to-date ranged weapon and Agility; check whether each bonus benefits you, your pet, or both.'],
    ['Choose your moment. Take the shot.', 'Ranged damage built around positioning and steady access to your target.', 'Plan your firing position, manage Mana, and use crowd control before a pull gets out of hand.', 'Ranged weapon quality, Agility, and appropriate accuracy before narrow damage bonuses.'],
    ['Prepare the ground before the fight.', 'A control-oriented hunter makes traps and space part of the damage plan.', 'Place traps deliberately, keep an escape route, and do not let pet movement break crowd control.', 'Balance damage equipment with the health and resources needed for your encounters.'],
  ],
  rogue: [
    ['Choose the opening. Finish cleanly.', 'Poison and finisher play rewards careful target choice and resource planning.', 'Prepare poisons, pool Energy for important windows, and spend combo points before your target dies.', 'Weapons suited to your abilities, Agility, and melee accuracy.'],
    ['Stay in the fight.', 'A direct melee approach for consistent pressure and repeatable pulls.', 'Keep a reliable weapon setup, interrupt dangerous casts, and use escape tools before health runs out.', 'Weapon upgrades are important; compare weapon speed and ability requirements as well as damage.'],
    ['Win before the enemy responds.', 'Stealth and disruption reward choosing when and where combat starts.', 'Use control to isolate a target; keep an exit available instead of spending every cooldown on the opener.', 'A suitable opener weapon, Agility, and enough Stamina for contested fights.'],
  ],
  priest: [
    ['Prevent the crisis.', 'A protective support style blends absorb effects, healing, and Mana planning.', 'Anticipate predictable damage and avoid refreshing protection that is not being consumed.', 'Intellect, healing effectiveness, and sustainable regeneration rather than a universal fixed stat order.'],
    ['Answer damage with measured healing.', 'A healing-focused toolkit for keeping a party stable through changing damage patterns.', 'Choose efficient healing when safe, reserve fast expensive casts for urgency, and track dispellable effects.', 'Healing effectiveness and Mana sustain, with enough health to survive unavoidable damage.'],
    ['Let pressure build.', 'A ranged damage path focused on shadow magic and sustained pressure.', 'Keep useful damage-over-time effects active without wasting Mana on enemies that will die immediately.', 'Spell effectiveness, Intellect, and enough accuracy for the content you are fighting.'],
  ],
  shaman: [
    ['Call lightning. Control the tempo.', 'Ranged elemental damage combines direct casts with totem support and interrupts.', 'Keep a safe casting position, manage Mana between pulls, and select totems for the party rather than damage alone.', 'Spell damage, Intellect, and Mana sustain; verify current talent interactions before chasing a hit target.'],
    ['Let steel carry the elements.', 'A melee hybrid uses weapon attacks, shocks, and totems while retaining emergency support.', 'Keep weapon imbues active, respect threat, and hold enough Mana for utility or a recovery heal.', 'Weapon quality and melee-relevant stats; read the current Intellect conversion talents before comparing hybrids.'],
    ['Keep the whole party flowing.', 'Water Shield, Mana Tide, Healing Wave, and Riptide give a Restoration Shaman tools for both recovery and endurance.', 'Heal for urgency, not a fixed rotation. Choose Chain Heal when allies can benefit from its jumps and keep a fast emergency option ready.', 'Healing effectiveness, Intellect, and regeneration. Mindfulness makes Spirit worth evaluating; there is no universal tested BiS ranking here.'],
  ],
  mage: [
    ['Spend Mana with a purpose.', 'Arcane play rewards deliberate resource use and reading interactions across spell schools.', 'Read Arcane Blast and Missile Barrage in the current snapshot; plan follow-up spells instead of exhausting Mana automatically.', 'Spell damage, Intellect, and sustainable casting; check spell-school scope on each bonus.'],
    ['Build toward the critical moment.', 'Fire emphasizes direct damage and critical-strike interactions.', 'Watch your current proc descriptions, keep threat manageable, and avoid investing long casts into nearly dead targets.', 'Spell damage and relevant accuracy before assuming critical strike is always the best upgrade.'],
    ['Keep danger at a distance.', 'Frost brings slows, roots, and defensive control to ranged damage.', 'Use control proactively; read Ice Lance and Fingers of Frost before deciding how to spend a proc.', 'Spell effectiveness, Intellect, and survivability; control is only useful while you have room to move.'],
  ],
  warlock: [
    ['Win the longer exchange.', 'Damage-over-time effects and resource conversion favor careful pull selection.', 'Apply effects only when they have time to work; balance health conversion against incoming damage and healer workload.', 'Spell damage, Mana and health resources, and relevant spell accuracy.'],
    ['Make your demon part of the plan.', 'Companion-focused play adds pet management and defensive options to your spellcasting.', 'Choose a demon for the encounter, control its movement, and check your current pet-related talent descriptions.', 'Evaluate both personal and demon benefits; avoid assuming every spell bonus transfers to your companion.'],
    ['Commit to the cast.', 'Direct destructive magic rewards stable positioning and controlled burst.', 'Plan casts around movement, watch threat, and preserve enough resources for utility and survival.', 'Spell damage and accuracy, then encounter-appropriate critical and resource bonuses.'],
  ],
  druid: [
    ['Bring the sky into the battle.', 'A ranged spellcasting path with access to the Druid’s flexible support toolkit.', 'Plan Mana around the pull, control enemies when appropriate, and shift roles only when the situation warrants it.', 'Caster equipment, Intellect, and spell effectiveness rather than feral weapon assumptions.'],
    ['One tree. Two feral callings.', 'Cat damage and Bear tanking need different equipment and different priorities.', 'Choose your role before spending points; use Bear positioning and mitigation for tanking, Energy planning for Cat.', 'Maintain separate tank and damage equipment where possible; do not use one fixed stat list for both forms.'],
    ['Help recovery take root.', 'A healing path that rewards preparation and attention to damage-over-time patterns.', 'Apply healing over time where it will be used, cover emergencies with appropriate direct healing, and manage Mana.', 'Healing effectiveness and sustainable regeneration, with sufficient Intellect for your encounter length.'],
  ],
};

// A transparent healing-first route. This is an editorial proposal, not a simulation result.
export const restorationRoute = [
  ['Improved Healing Wave', 5], ['Tidal Focus', 5], ['Water Shield', 1],
  ['Mindfulness', 3], ['Totemic Focus', 1], ['Mana Tide Totem', 1],
  ['Tidal Mastery', 4], ["Nature's Swiftness", 1], ['Healing Way', 3],
  ['Tidal Mastery', 1], ['Purification', 5], ['Riptide', 1],
  ['Healing Focus', 3], ['Ancestral Healing', 3], ['Totemic Focus', 4],
  ['Ancestral Knowledge', 5], ['Thundering Strikes', 5],
].flatMap(([name, count]) => Array.from({ length: count }, () => name));

export const restorationSections = [
  ['Healing priorities', [
    'Before a pull: drink if needed, check Water Shield charges after learning the talent, and place totems where the group will fight.',
    'A player about to die takes priority over perfect efficiency. Use a suitable fast heal or Nature’s Swiftness with a Nature heal if talented.',
    'Use Healing Wave when a direct heal has time to land. Cancel an unnecessary cast when safe rather than spending Mana on avoidable overhealing.',
    'Once learned, use Riptide for immediate healing, movement, and sustained damage. Its bonus applies when Chain Heal is cast directly on that target; do not force a wasteful Chain Heal for the bonus.',
    'Use Chain Heal when several injured allies are close enough to benefit. Spread-out or lightly injured targets often call for a different heal.',
  ]],
  ['Troll racial toolkit', [
    'Berserking: the October 27 racial reference lists 10% attack and casting speed for 15 seconds, on a 3-minute cooldown. Use the casting window during expected pressure; faster casting can also spend Mana faster.',
    'Rapid Regeneration: restores 50% maximum Health over 6 seconds, on a 3-minute cooldown. Movement, actions, or damage cancel the channel. Use a safe recovery window, not while the party urgently needs healing.',
    'Regeneration is health regeneration, not Mana regeneration. Do not count it as a solution to going out of Mana.',
    'Beast Slaying improves damage to beasts; it is not a healing multiplier. Troll Priest-only abilities are not available to a Shaman.',
  ]],
  ['Totems and Mana', [
    'There is no single mandatory totem set. Choose utility for the enemies, the party composition, and the expected damage.',
    'Water slot: Mana Spring supports sustain, Healing Stream supports steady healing, and Mana Tide is a timed recovery cooldown after learning it. These share an elemental slot; track replacements.',
    'Earth and Air slots: choose defensive, control, resistance, or party damage support as needed. Use Tremor or Grounding where the actual encounter makes them useful.',
    'Place a Fire totem only when it is useful and safe. Extra damage is not worth breaking crowd control, pulling another pack, or losing Mana needed for healing.',
    'Call of the Elements and Totemic Recall become available at level 20; Totemic Projection at 22, according to the developer deep dive. Learn them from your trainer and verify current costs and behavior in game.',
    'Refresh Water Shield when charges are gone and it is safe. Plan Mana Tide early enough that its restoration is useful rather than waiting until you cannot cast.',
  ]],
  ['Leveling, equipment, and preparation', [
    'This talent route is healing-first for frequent dungeon groups. It sacrifices solo damage; a damage specialization can be more practical if most of your time is spent questing alone.',
    'At level 40, Dual Specialization is available according to Blizzard’s class deep dive. Consider separate questing and healing setups rather than expecting one build to excel at both.',
    'Carry water, train new heal ranks, and keep your healing weapon and shield current. Compare healing power, Intellect, Spirit, other regeneration, and survivability for your actual content.',
    'Set up party frames and comfortable bindings for direct heals, dispels, interrupts, totems, and emergency cooldowns. Track Water Shield and Riptide rather than relying on memory.',
    'No fixed raid BiS, fastest-leveling claim, or numerical healing ranking is asserted here. Talent values are a beta snapshot and can differ from launch hotfixes.',
  ]],
];

export const levelingReasons = {
  'Improved Healing Wave': 'Start by shortening your main direct heal. Before level 10 you have no base talent points; train spells and practice safe healing instead.',
  'Tidal Focus': 'Reduce healing Mana costs and build the ten points needed to unlock Water Shield.',
  'Water Shield': 'Your first major sustain tool. Track its charges; this replaces other Elemental Shields.',
  'Mindfulness': 'Keep part of your Mana regeneration while casting. Its value depends on your regeneration and equipment.',
  'Totemic Focus': 'Reduce the cost of your totems and spells that summon or move them. The first point also completes the early-row budget for Mana Tide.',
  'Mana Tide Totem': 'Unlock a planned group Mana cooldown. Use it while its restoration is still useful, not after the group has already run dry.',
  'Tidal Mastery': 'Add healing critical chance. Critical heals can also interact with Water Shield; keep watching its charges.',
  "Nature's Swiftness": 'Add an emergency instant Nature spell. Keep it deliberately bound and pair it with the heal the situation needs.',
  'Healing Way': 'Improve Healing Wave and satisfy the prerequisite for Riptide later in the route.',
  'Purification': 'Improve healing effectiveness while finishing the thirty-point investment needed for Riptide.',
  'Riptide': 'Add an instant heal and heal over time. Learn its direct-target Chain Heal interaction without forcing overhealing.',
  'Healing Focus': 'Reduce healing pushback when you take damage. This does not prevent interrupts or make standing in danger safe.',
  'Ancestral Healing': 'Critical heals can provide an armor benefit. This is defensive utility, not a substitute for keeping the target alive.',
  'Ancestral Knowledge': 'Finish the healing core first, then add Intellect from the first Enhancement row. These are not Restoration-tree points.',
  'Thundering Strikes': 'The snapshot increases critical chance for spells and attacks. These last points are a flexible supporting choice, not a proven best-in-slot allocation.',
};

export const healingMacros = [
  ['Mouseover Healing Wave', '#showtooltip Healing Wave\n/cast [@mouseover,help,nodead][help,nodead][@player] Healing Wave'],
  ['Mouseover Lesser Healing Wave', '#showtooltip Lesser Healing Wave\n/cast [@mouseover,help,nodead][help,nodead][@player] Lesser Healing Wave'],
  ['Mouseover Riptide (when talented)', '#showtooltip Riptide\n/cast [@mouseover,help,nodead][help,nodead][@player] Riptide'],
];
