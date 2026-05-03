import { useGame } from '../contexts/GameContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { HudHeader } from '../ui/HudHeader.jsx';
import { TIER_COLOR, itemSalvageValue } from '../data/inventory.js';
import { Button } from '../ui/Button.jsx';

export function Inventory() {
  const { inventory, activeAvatar, toggleEquip, coins, shopItems, salvageItem, buyShopItem, refreshShop } = useGame();
  const { fantasy } = useTheme();

  const equippedIds = activeAvatar.equippedIds || [];

  return (
    <div className="screen-enter">
      <HudHeader
        title={fantasy ? 'The Hoard' : 'Vault · Inventory'}
        sub={fantasy ? 'FANTASY · BOUNTY' : 'SOLO LEVELING · LOOT'}
      />
      <div style={{ padding: '4px 16px 0' }}>
        <Panel glass ticks style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div className="hud" style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.2em' }}>COINS</div>
              <div className="mythic" style={{ color: 'var(--ink)', fontSize: 26, marginTop: 4 }}>{coins}</div>
            </div>
            <Button variant="ghost" style={{ padding: '8px 12px', fontSize: 10 }} onClick={refreshShop}>
              Refresh Shop
            </Button>
          </div>
        </Panel>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="hud" style={{ fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.2em', marginBottom: 10 }}>
          ITEM MARKET
        </div>
        <div style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
        }}>
          {shopItems.map(it => (
            <ItemCard
              key={it.id}
              item={it}
              actionLabel={coins >= it.price ? `Buy · ${it.price} coins` : `${it.price} coins`}
              actionDisabled={coins < it.price}
              onAction={() => buyShopItem(it.id)}
              footer={`${it.slot} · ${it.tier}`}
            />
          ))}
        </div>
      </div>

      <div className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.2em', padding: '18px 16px 0' }}>
        OWNED ITEMS
      </div>
      <div style={{ 
        padding: '4px 16px 130px', 
        display: 'grid', 
        gap: 16, 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' 
      }}>
        {inventory.map(it => {
          const isEquipped = equippedIds.includes(it.id);
          
          return (
            <ItemCard
              key={it.id}
              item={it}
              equipped={isEquipped}
              actionLabel={isEquipped ? (fantasy ? 'UNEQUIP' : 'REMOVE') : (fantasy ? 'EQUIP' : 'USE')}
              onAction={() => toggleEquip(it.id)}
              secondaryLabel={`Salvage · +${itemSalvageValue(it)} coins`}
              onSecondary={() => salvageItem(it.id)}
              footer={`${it.slot} · ${it.tier}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ItemCard({ item, equipped = false, actionLabel, actionDisabled = false, onAction, secondaryLabel, onSecondary, footer }) {
  const tc = TIER_COLOR[item.tier];

  return (
    <Panel
      glass
      ticks
      className="card-item"
      style={{ padding: 16, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${tc.a}20, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 56, height: 56, margin: '0 auto 12px',
          borderRadius: 14, background: `linear-gradient(135deg, ${tc.a}, ${tc.b})`,
          display: 'grid', placeItems: 'center',
          boxShadow: `0 0 24px ${tc.a}44`,
          fontFamily: 'Cinzel, serif', fontSize: 22, color: '#fff', fontWeight: 700,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {item.name[0]}
        </div>

        <div className="mythic" style={{ fontSize: 14, color: 'var(--ink)', textAlign: 'center', minHeight: 32, lineHeight: 1.2 }}>
          {item.name}
        </div>

        <div className="hud" style={{ fontSize: 9, letterSpacing: '0.16em', color: tc.a, textAlign: 'center', marginTop: 4, fontWeight: 700 }}>
          {tc.text.toUpperCase()}
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-dim)', textAlign: 'center', marginTop: 6 }}>{footer}</div>

        <div style={{ fontSize: 11, color: 'var(--ink-dim)', textAlign: 'center', marginTop: 8, lineHeight: 1.4, flex: 1 }}>
          {item.desc || 'Market item. Buy it with coins or earn it from training.'}
        </div>

        {item.stats && Object.keys(item.stats).length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 4,
            justifyContent: 'center', marginTop: 12, marginBottom: 12,
            background: 'rgba(0,0,0,0.2)', padding: 6, borderRadius: 6
          }}>
            {Object.entries(item.stats).map(([k, v]) => (
              <span key={k} className="hud" style={{ fontSize: 10, color: 'var(--cyan)' }}>
                +{v} {k}
              </span>
            ))}
          </div>
        )}

        <Button
          variant={equipped ? 'ghost' : 'primary'}
          style={{ width: '100%', marginTop: 'auto', padding: '8px 0', fontSize: 10 }}
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </Button>

        {secondaryLabel && (
          <button
            type="button"
            onClick={onSecondary}
            style={{
              marginTop: 8,
              border: '1px solid var(--line)',
              borderRadius: 8,
              background: 'rgba(13,15,30,0.45)',
              color: 'var(--gold)',
              padding: '8px 0',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            {secondaryLabel}
          </button>
        )}

        {equipped && (
          <div style={{
            position: 'absolute', top: -10, right: -10,
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--cyan)', color: '#000',
            display: 'grid', placeItems: 'center', fontSize: 12,
            fontWeight: 700, boxShadow: '0 0 12px var(--cyan)'
          }}>
            ✓
          </div>
        )}
      </div>
    </Panel>
  );
}
