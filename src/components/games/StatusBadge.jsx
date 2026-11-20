import { GAME_STATUS_LABELS } from '../../utils/constants.js'
import './StatusBadge.css'

export default function StatusBadge({ estado }) {
  return <span className={`insignia-estado insignia-estado--${estado}`}>{GAME_STATUS_LABELS[estado]}</span>
}
