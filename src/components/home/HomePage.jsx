import BudgetExperienceCanvas from './BudgetExperienceCanvas'
import CenterLanding from './CenterLanding'
import '../../home-world.css'

export default function HomePage({ onStart }) {
  return (
    <BudgetExperienceCanvas>
      <CenterLanding onStart={onStart} />
    </BudgetExperienceCanvas>
  )
}
