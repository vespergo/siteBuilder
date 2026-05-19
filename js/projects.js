/**
 * js/projects.js
 * Handles the project manager view (mock data, listing, deleting, mock import)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Projects Data
    const STORAGE_KEY = 'siteBuilderProjects';
    let projects = [];

    // Load projects from localStorage
    function loadProjects() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                projects = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load projects', e);
            projects = [];
        }
    }

    // Save projects to localStorage
    function saveProjects() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (e) {
            console.error('Failed to save projects', e);
        }
    }

    // Load initial data
    loadProjects();

    // DOM Elements
    const projectsGrid = document.getElementById('projects-grid');
    const emptyState = document.getElementById('empty-state');
    const btnNew = document.getElementById('btn-new');
    const btnEmptyNew = document.getElementById('btn-empty-new');
    const btnImport = document.getElementById('btn-import');
    const importFileInput = document.getElementById('import-file');

    // Format date nicely
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Render projects list
    function renderProjects() {
        projectsGrid.innerHTML = '';

        if (projects.length === 0) {
            projectsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        projectsGrid.style.display = 'grid';
        emptyState.style.display = 'none';

        // Sort by last modified descending
        projects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                
                <div class="project-info">
                    <h3 class="project-title">${escapeHtml(project.name)}</h3>
                    <p class="project-meta">
                        Last edited: ${formatDate(project.lastModified)}<br>
                        ${project.componentCount || 0} components
                    </p>
                    <div class="project-actions">
                        <button class="btn btn-primary" onclick="openProject('${project.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Simple HTML escaper
    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/[&<"']/g, function(m) {
            switch (m) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '"': return '&quot;';
                case "'": return '&#039;';
            }
        });
    }

    // Actions (Exposed to window for inline onclick handlers)
    window.openProject = function(id) {
        window.location.href = 'index.html?project=' + id;
    };

    window.deleteProject = function(id) {
        if(confirm('Are you sure you want to delete this project?')) {
            projects = projects.filter(p => p.id !== id);
            saveProjects();
            // Also clean up the components for this project
            localStorage.removeItem('siteBuilderComponents_' + id);
            renderProjects();
        }
    };

    // Event Listeners
    const createNewProject = () => {
        const name = prompt("Enter project name:", "New Project");
        if (name) {
            const newProj = {
                id: 'proj_' + Date.now(),
                name: name,
                lastModified: new Date().toISOString(),
                componentCount: 0
            };
            projects.unshift(newProj);
            saveProjects();
            
            // Open the newly created project
            window.openProject(newProj.id);
        }
    };

    btnNew.addEventListener('click', createNewProject);
    btnEmptyNew.addEventListener('click', createNewProject);

    btnImport.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    // Try parsing as JSON first
                    const importedData = JSON.parse(event.target.result);
                    // Check if it looks like our components array
                    if (Array.isArray(importedData)) {
                        const newProj = {
                            id: 'proj_' + Date.now(),
                            name: 'Imported: ' + file.name.split('.')[0],
                            lastModified: new Date().toISOString(),
                            componentCount: importedData.length
                        };
                        
                        // Save components specific to this project
                        localStorage.setItem('siteBuilderComponents_' + newProj.id, JSON.stringify(importedData));
                        
                        // Save project metadata
                        projects.unshift(newProj);
                        saveProjects();
                        renderProjects();
                    } else {
                        alert("Invalid project format.");
                    }
                } catch (err) {
                    alert("Could not parse file. Please upload a valid JSON project file.");
                }
            };
            
            reader.readAsText(file);
            // Reset input
            importFileInput.value = '';
        }
    });

    // Initial render
    renderProjects();
});