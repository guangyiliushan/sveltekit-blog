<script lang="ts">
    import { page } from '$app/state';
    import avatar from '$lib/images/default.svg';
    import { 
        IconHome, 
        IconBook, 
        IconChevronDown, 
        IconUser, 
        IconLogout 
    } from '@tabler/icons-svelte';
    
    let sidebarOpen = $state(true);
    let activeSubmenu = $state<string | null>(null);
</script>

<div class="sidebar-container">
    <div class="sidebar" class:close={!sidebarOpen}>
        <div class="profile-details">
            <div class="profile-content">
                <img src={avatar} alt="profile" />
            </div>
            <div class="name-job">
                <div class="profile_name">用户昵称</div>
                <div class="job">开发者</div>
            </div>
            <a href="/logout" class="logout-btn">
                <IconLogout size={24} />
            </a>
        </div>
        <ul class="nav-links">
            <!-- 首页导航项 -->
            <li class:active={page.url.pathname === '/'}>
                <a href="/" class="nav-link">
                    <IconHome size={24} class="nav-icon" />
                    <span class="link_name">首页</span>
                    <div class="tooltip">首页</div>
                </a>
            </li>
            
            <!-- 博客导航 --> 
            <li class:show-submenu={activeSubmenu === 'blog'}>
                <div class="nav-link" 
                    on:click={() => activeSubmenu = activeSubmenu === 'blog' ? null : 'blog'}>
                    <div class="menu-content">
                        <IconBook size={24} class="nav-icon" />
                        <span class="link_name">博客管理</span>
                    </div>
                    <IconChevronDown size={18} />
                </div>
                <ul class="sub-menu">
                    <li><a href="/blog" class:active={page.url.pathname.startsWith('/blog')}>所有文章</a></li>
                    <li><a href="/blog/new">写新文章</a></li>
                </ul>
            </li>
        </ul>
    </div>
</div>

<style>
    /* 新增容器样式 */
    .sidebar-container {
        position: relative;
        z-index: 100;
    }
    
    .sidebar {
        --sidebar-width: 240px;
        --sidebar-padding: 16px;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 78px;
        background: var(--color-bg-1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 100;
        padding: var(--sidebar-padding);
        overflow: hidden;
    }

    .sidebar:not(.close):hover {
        width: var(--sidebar-width);
        box-shadow: 0 0 30px rgba(0,0,0,0.1);
    }

    /* 导航项悬停效果 */
    .nav-link {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        transition: background 0.2s;
    }

    .nav-link:hover {
        background: rgba(110, 90, 240, 0.1);
    }

    .active .nav-link {
        background: var(--color-theme-1);
        color: white;
    }

    .active .nav-link::before {
        content: '';
        position: absolute;
        right: -24px;
        width: 24px;
        height: 24px;
        background: var(--color-theme-1);
        border-radius: 50%;
        box-shadow: 4px 4px 0 4px var(--color-bg-1);
    }

    .sub-menu {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .show-submenu .sub-menu {
        max-height: 500px;
    }

    .link_name {
        opacity: 0;
        transition: opacity 0.2s;
        margin-left: 16px;
    }

    .sidebar:not(.close):hover .link_name {
        opacity: 1;
    }
</style>