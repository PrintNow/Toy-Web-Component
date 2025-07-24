class DropdownMenu extends HTMLElement {
  constructor() {
    super();
    // 创建 Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // 默认菜单数据
    const menuData = JSON.parse(this.getAttribute('menu-data') || '[]');
    
    // 渲染组件
    this.render(menuData);
    
    // 绑定事件
    this.bindEvents();
  }

  render(menuData) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #2b3138;
          --dropdown-bg: #fff;
          --text-color: #333;
          --hover-bg: #f8f9fa;
          position: relative;
          display: inline-block;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 6px;
        }

        .dropdown-button:hover {
          opacity: 0.9;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background-color: var(--dropdown-bg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 4px;
          z-index: 1000;
        }

        .dropdown-menu.active {
          display: block;
        }

        .menu-item {
          position: relative;
        }

        .menu-item a {
          display: block;
          text-align: left;
          padding: 10px 6px;
          color: var(--text-color);
          text-decoration: none;
          font-size: 13px;
        }

        .menu-item a:hover {
          background-color: var(--hover-bg);
        }

        .submenu {
          display: none;
          position: absolute;
          left: 100%;
          top: 0;
          min-width: 130px;
          background-color: var(--dropdown-bg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 4px;
        }

        .menu-item:hover .submenu {
          display: block;
        }

        .arrow {
          margin-left: 5px;
          display: inline-block;
        }
      </style>

      <div class="dropdown">
        <button class="dropdown-button">
          <slot name="trigger">菜单</slot>
        </button>
        <div class="dropdown-menu">
          ${menuData.map(item => `
            <div class="menu-item">
              <a target="_blank" href="${item.link || '#'}">${item.label}${item.children ? '<span class="arrow">▶</span>' : ''}</a>
              ${item.children ? `
                <div class="submenu">
                  ${item.children.map(subItem => `
                    <a target="_blank" href="${subItem.link || '#'}">${subItem.label}</a>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const button = this.shadowRoot.querySelector('.dropdown-button');
    const menu = this.shadowRoot.querySelector('.dropdown-menu');

    button.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }

  // 监听属性变化
  static get observedAttributes() {
    return ['menu-data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'menu-data' && oldValue !== newValue) {
      this.render(JSON.parse(newValue || '[]'));
      this.bindEvents();
    }
  }
}

// 定义 Web Component
customElements.define('dropdown-menu', DropdownMenu);
