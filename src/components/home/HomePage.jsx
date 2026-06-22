import BudgetExperienceCanvas from './BudgetExperienceCanvas'
import CenterLanding from './CenterLanding'
import '../../home-world.css'

export default function HomePage({ onStart, onJson }) {
  return (
    <BudgetExperienceCanvas>
      <CenterLanding onStart={onStart} onJson={onJson} />
    </BudgetExperienceCanvas>
  )
}
