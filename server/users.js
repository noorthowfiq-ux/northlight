
const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString()

export const users = [
  {
    id: 'usr_01',
    email: 'mara@northlight.app',
    password: 'northlight123', 
    name: 'Mara Lindqvist',
    role: 'Design Lead',
    activity: [
      { at: ago(34), icon: 'message', text: 'Commented on “Aurora sprint — final review”' },
      { at: ago(190), icon: 'git', text: 'Merged PR #214 — contour grid module' },
      { at: ago(420), icon: 'file', text: 'Exported field report for Lindqvist & Co' },
      { at: ago(1560), icon: 'pen', text: 'Drafted the winter roadmap note' },
    ],
  },
  {
    id: 'usr_02',
    email: 'jonas@northlight.app',
    password: 'aurora-borealis',
    name: 'Jonas Ek',
    role: 'Product Engineer',
    activity: [
      { at: ago(58), icon: 'git', text: 'Pushed 3 commits to field-system' },
      { at: ago(310), icon: 'message', text: 'Reviewed Mara’s type specimen sheet' },
      { at: ago(1240), icon: 'pen', text: 'Filed 5 issues for the winter sprint' },
    ],
  },
]