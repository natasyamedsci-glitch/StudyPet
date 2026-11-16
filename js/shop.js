/**
 * STUDYPET — Shop & Inventory System
 * Pet Food, Hats, Clothing, Furniture, Backgrounds & Equipment Engine
 */

const SHOP_CATALOG = [
  // --- FOOD ---
  { id: 'berry_tart', category: 'food', name: 'Berry Tart', price: 15, rarity: 'common', icon: '🥧', desc: 'A warm berry pastry baked with cinnamon. Restores 30 Hunger & 15 Energy.' },
  { id: 'moon_berries', category: 'food', name: 'Moon Berries', price: 25, rarity: 'rare', icon: '🫐', desc: 'Glowing nightshade berries that taste like cool starlight. Restores 40 Hunger & +10 Happiness.' },
  { id: 'golden_apple', category: 'food', name: 'Golden Honey Apple', price: 45, rarity: 'epic', icon: '🍏', desc: 'A crisp orchard apple drizzled in enchanted honey. Fully replenishes Hunger & Energy!' },
  { id: 'matcha_biscuit', category: 'food', name: 'Matcha Biscuit', price: 18, rarity: 'common', icon: '🍵', desc: 'A rich green tea cookie favored by studious scholars.' },

  // --- HATS ---
  { id: 'scholar_cap', category: 'hat', name: 'Scholar Cap', price: 35, rarity: 'common', icon: '🎓', desc: 'The traditional ceremonial graduation mortarboard with a golden tassel.' },
  { id: 'wizard_hat', category: 'hat', name: 'Tiny Wizard Hat', price: 65, rarity: 'rare', icon: '🧙', desc: 'A starry pointed wizard cap imbued with whimsical spells of concentration.' },
  { id: 'cozy_beanie', category: 'hat', name: 'Cozy Beanie', price: 40, rarity: 'common', icon: '🧶', desc: 'A soft ribbed knit beanie for chilly autumn study sessions.' },
  { id: 'flower_wreath', category: 'hat', name: 'Floral Wreath', price: 55, rarity: 'rare', icon: '🌸', desc: 'A circlet of blooming spring wildflowers and clover leaves.' },

  // --- CLOTHING ---
  { id: 'knit_scarf', category: 'clothing', name: 'Warm Knitted Scarf', price: 30, rarity: 'common', icon: '🧣', desc: 'A cozy hand-woven woolen scarf in soothing terracotta hues.' },
  { id: 'student_cape', category: 'clothing', name: 'Academy Cape', price: 75, rarity: 'epic', icon: '🧥', desc: 'A noble velvet cape tailored for honor roll scholars.' },

  // --- ROOM DECOR & FURNITURE ---
  { id: 'bookshelf', category: 'furniture', name: 'Oak Bookshelf', price: 50, rarity: 'common', icon: '📚', desc: 'A sturdy hand-crafted oak shelf filled with classical volumes and scrolls.' },
  { id: 'plant', category: 'furniture', name: 'Bonsai Tree', price: 40, rarity: 'common', icon: '🪴', desc: 'A serene potted bonsai that purifies the room\'s study aura.' },
  { id: 'rug', category: 'furniture', name: 'Pastel Handwoven Rug', price: 35, rarity: 'common', icon: '🧶', desc: 'A circular cozy rug providing warmth for your companion.' },

  // --- ROOM BACKGROUNDS ---
  { id: 'attic', category: 'background', name: 'Cozy Attic Study', price: 80, rarity: 'rare', icon: '🏡', desc: 'Warm timber beams, sunlight streaming through an arched dormer window.' },
  { id: 'forest', category: 'background', name: 'Enchanted Forest Nook', price: 100, rarity: 'epic', icon: '🌲', desc: 'Study amidst mossy roots, floating glowing pollen, and gentle birdsong.' },
  { id: 'twilight', category: 'background', name: 'Twilight Library', price: 120, rarity: 'legendary', icon: '🌌', desc: 'A quiet midnight observatory overlooking glittering constellations.' },
  { id: 'greenhouse', category: 'background', name: 'Sunlit Greenhouse', price: 90, rarity: 'rare', icon: '🌿', desc: 'Surrounded by blossoming botanical wonders and gentle glass acoustics.' },

  // --- SPECIAL ---
  { id: 'streak_freeze', category: 'special', name: 'Streak Freeze Charm', price: 60, rarity: 'rare', icon: '❄️', desc: 'Protects your streak if you miss a single day of studying.' }
];

class ShopManager {
  constructor() {
    this.store = window.dataStore;
    this.currentCategory = 'all';
  }

  get inventory() {
    return this.store.state.inventory || [];
  }

  isItemPurchased(itemId) {
    return this.inventory.some(i => i.id === itemId);
  }

  isItemEquipped(itemId) {
    const pet = this.store.state.pet;
    if (!pet) return false;
    if (pet.equipped) {
      if (pet.equipped.head === itemId || pet.equipped.neck === itemId || pet.equipped.body === itemId || pet.equipped.back === itemId || pet.equipped.special === itemId) {
        return true;
      }
    }
    return pet.equippedHat === itemId || pet.equippedScarf === itemId || pet.roomBg === itemId || (pet.roomDecor && pet.roomDecor.includes(itemId));
  }

  buyItem(itemId) {
    const item = SHOP_CATALOG.find(i => i.id === itemId);
    if (!item) return;

    if (this.isItemPurchased(itemId) && item.category !== 'food') {
      if (window.app) window.app.showToast('Already Owned', 'You already have this item in your inventory!', 'default');
      return;
    }

    if ((this.store.state.user.coins || 0) < item.price) {
      if (window.soundEngine) window.soundEngine.playClick();
      if (window.app) window.app.showToast('Insufficient Coins', `You need ${item.price} Study Coins. Keep studying to earn more! 🪙`, 'default');
      return;
    }

    // Deduct coins & record transaction
    this.store.spendCoins(item.price, `Purchased: ${item.name}`);

    // Add to inventory
    const existing = this.inventory.find(i => i.id === itemId);
    if (existing && item.category === 'food') {
      existing.count = (existing.count || 1) + 1;
    } else {
      this.store.state.inventory.push({
        id: item.id,
        category: item.category,
        name: item.name,
        equipped: false,
        count: 1
      });
    }

    this.store.saveState();
    if (window.soundEngine) window.soundEngine.playCoin();
    if (window.app) {
      window.app.showToast('Purchase Successful! ✨', `Added "${item.name}" to your inventory.`, 'coin');
      window.app.renderAll();
    }
  }

  toggleEquip(itemId) {
    const item = SHOP_CATALOG.find(i => i.id === itemId);
    if (!item) return;

    const pet = this.store.state.pet;

    if (item.category === 'hat') {
      const isEquipped = (pet.equipped && pet.equipped.head === itemId) || pet.equippedHat === itemId;
      if (isEquipped) {
        window.petManager.unequipItem('head');
      } else {
        window.petManager.equipItem(itemId, 'head');
      }
      return;
    } else if (item.category === 'clothing') {
      const targetSlot = (itemId === 'student_cape') ? 'body' : 'neck';
      const isEquipped = (pet.equipped && pet.equipped[targetSlot] === itemId) || (targetSlot === 'neck' && pet.equippedScarf === itemId);
      if (isEquipped) {
        window.petManager.unequipItem(targetSlot);
      } else {
        window.petManager.equipItem(itemId, targetSlot);
      }
      return;
    } else if (item.category === 'background') {
      pet.roomBg = itemId;
    } else if (item.category === 'furniture') {
      if (!pet.roomDecor) pet.roomDecor = [];
      if (pet.roomDecor.includes(itemId)) {
        pet.roomDecor = pet.roomDecor.filter(d => d !== itemId);
      } else {
        pet.roomDecor.push(itemId);
      }
    } else if (item.category === 'food') {
      // Feed to pet!
      if (window.petManager) {
        window.petManager.feedPet(item);
        const invItem = this.inventory.find(i => i.id === itemId);
        if (invItem) {
          invItem.count = (invItem.count || 1) - 1;
          if (invItem.count <= 0) {
            this.store.state.inventory = this.inventory.filter(i => i.id !== itemId);
          }
        }
        this.store.saveState();
      }
    }

    this.store.saveState();
    if (window.soundEngine) window.soundEngine.playSparkle();
    if (window.app) window.app.renderAll();
  }

  renderShopGrid() {
    const items = SHOP_CATALOG.filter(item => {
      if (this.currentCategory === 'all') return true;
      return item.category === this.currentCategory;
    });

    return items.map(item => {
      const owned = this.isItemPurchased(item.id);
      const equipped = this.isItemEquipped(item.id);

      return `
        <div class="shop-item-card">
          <span class="badge" style="position: absolute; top: 12px; left: 12px; font-size: 0.65rem;">
            ${item.rarity.toUpperCase()}
          </span>
          <div class="shop-item-preview">${item.icon}</div>
          <div class="shop-item-title">${item.name}</div>
          <div class="shop-item-desc">${item.desc}</div>
          <div class="shop-item-price">🪙 ${item.price} Coins</div>

          <div style="width: 100%; margin-top: auto;">
            ${owned && item.category !== 'food' ? `
              <button class="btn ${equipped ? 'btn-secondary' : 'btn-outline'} btn-sm" style="width: 100%;" onclick="window.shopManager.toggleEquip('${item.id}')">
                ${equipped ? '✓ Equipped' : 'Equip Item'}
              </button>
            ` : owned && item.category === 'food' ? `
              <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.shopManager.toggleEquip('${item.id}')">
                Feed Pet 🍰
              </button>
            ` : `
              <button class="btn btn-gold btn-sm" style="width: 100%;" onclick="window.shopManager.buyItem('${item.id}')">
                Buy Item
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }
}

// Global Shop Instance
const shopManager = new ShopManager();
window.shopManager = shopManager;

