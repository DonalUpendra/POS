import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Tag as TagIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface LabelTemplate {
  id: string;
  name: string;
  size: string;
  description?: string;
  fields: string[];
  fontSize: string;
  orientation: string;
}

interface LabelGeneration {
  id: string;
  date: string;
  template: string;
  products: number;
  labelsGenerated: number;
  status: 'completed' | 'pending' | 'failed';
}

const Labels: React.FC = () => {
  const [templates] = useState<LabelTemplate[]>([
    {
      id: '1',
      name: 'Standard Label',
      size: '2.25x1.25',
      description: 'Standard product label',
      fields: ['name', 'price', 'barcode'],
      fontSize: 'medium',
      orientation: 'portrait'
    }
  ]);

  const [recentGenerations] = useState<LabelGeneration[]>([
    {
      id: '1',
      date: '2024-12-15',
      template: 'Standard Label',
      products: 5,
      labelsGenerated: 25,
      status: 'completed'
    }
  ]);

  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showGenerateLabels, setShowGenerateLabels] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null);

  // Form states
  const [templateForm, setTemplateForm] = useState({
    name: '',
    size: '2.25x1.25',
    description: '',
    fields: ['name', 'price', 'barcode'],
    fontSize: 'medium',
    orientation: 'portrait'
  });

  const [generateForm, setGenerateForm] = useState({
    templateId: '',
    products: [] as string[],
    quantityPerProduct: 1,
    format: 'pdf',
    includeBarcode: true
  });

  const summaryStats = {
    availableTemplates: templates.length,
    productsWithLabels: 0, // Would be calculated from products
    labelsPrintedToday: recentGenerations
      .filter(gen => gen.date === new Date().toISOString().split('T')[0])
      .reduce((sum, gen) => sum + gen.labelsGenerated, 0),
    totalLabelsPrinted: recentGenerations.reduce((sum, gen) => sum + gen.labelsGenerated, 0)
  };

  const handleCreateTemplate = () => {
    console.log('Creating template:', templateForm);
    setShowCreateTemplate(false);
    resetTemplateForm();
  };

  const handleGenerateLabels = () => {
    console.log('Generating labels:', generateForm);
    setShowGenerateLabels(false);
    resetGenerateForm();
  };

  const handlePreviewTemplate = (template: LabelTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEditTemplate = (templateId: string) => {
    console.log('Editing template:', templateId);
    alert('Template editing would be implemented here');
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      console.log('Deleting template:', templateId);
    }
  };

  const handleViewLabels = (generationId: string) => {
    console.log('Viewing labels for generation:', generationId);
    alert('Label viewing would be implemented here');
  };

  const handlePrintLabels = (generationId: string) => {
    console.log('Printing labels for generation:', generationId);
    alert('Print functionality would be implemented here');
  };

  const handleDownloadLabels = (generationId: string) => {
    console.log('Downloading labels for generation:', generationId);
    alert('Download functionality would be implemented here');
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      size: '2.25x1.25',
      description: '',
      fields: ['name', 'price', 'barcode'],
      fontSize: 'medium',
      orientation: 'portrait'
    });
  };

  const resetGenerateForm = () => {
    setGenerateForm({
      templateId: '',
      products: [],
      quantityPerProduct: 1,
      format: 'pdf',
      includeBarcode: true
    });
  };

  const handleFieldChange = (field: string, checked: boolean) => {
    setTemplateForm(prev => ({
      ...prev,
      fields: checked
        ? [...prev.fields, field]
        : prev.fields.filter(f => f !== field)
    }));
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    setGenerateForm(prev => ({
      ...prev,
      products: checked
        ? [...prev.products, productId]
        : prev.products.filter(p => p !== productId)
    }));
  };

  const handleSelectAllProducts = (checked: boolean) => {
    // In a real app, this would get all product IDs
    const allProductIds = ['1', '2', '3']; // Mock data
    setGenerateForm(prev => ({
      ...prev,
      products: checked ? allProductIds : []
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case '2.25x1.25': return '2.25" x 1.25" (Standard)';
      case '3x1': return '3" x 1" (Large)';
      case '4x2': return '4" x 2" (Extra Large)';
      case '1.5x1': return '1.5" x 1" (Small)';
      default: return size;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Label Printing Tool
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowCreateTemplate(true)}>
            New Template
          </Button>
          <Button variant="contained" startIcon={<TagIcon />} onClick={() => setShowGenerateLabels(true)}>
            Generate Labels
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Available Templates
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.availableTemplates}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Label templates
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InventoryIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Products with Labels
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.productsWithLabels}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Products available
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PrintIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Labels Printed Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.labelsPrintedToday}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Labels printed
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssessmentIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" sx={{ fontSize: '14px' }}>
                Total Labels Printed
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {summaryStats.totalLabelsPrinted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All time total
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Label Templates Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Label Templates
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {templates.length === 0 ? (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Templates Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create your first label template
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateTemplate(true)}>
                Create Template
              </Button>
            </Box>
          ) : (
            templates.map((template) => (
              <Card key={template.id} sx={{ cursor: 'pointer' }} onClick={() => handlePreviewTemplate(template)}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {getSizeLabel(template.size)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.fields.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditTemplate(template.id); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* Recent Labels Section */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Recent Label Generations
        </Typography>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Labels Generated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentGenerations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                        <TagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No Recent Labels
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generated labels will appear here
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentGenerations.map((generation) => (
                      <TableRow key={generation.id}>
                        <TableCell>{generation.date}</TableCell>
                        <TableCell>{generation.template}</TableCell>
                        <TableCell>{generation.products}</TableCell>
                        <TableCell>{generation.labelsGenerated}</TableCell>
                        <TableCell>
                          <Chip
                            label={generation.status}
                            color={getStatusColor(generation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleViewLabels(generation.id)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handlePrintLabels(generation.id)}>
                            <PrintIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDownloadLabels(generation.id)}>
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Create Template Modal */}
      <Dialog open={showCreateTemplate} onClose={() => setShowCreateTemplate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Label Template</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Label Size</InputLabel>
              <Select
                value={templateForm.size}
                onChange={(e) => setTemplateForm({ ...templateForm, size: e.target.value })}
                label="Label Size"
              >
                <MenuItem value="2.25x1.25">2.25" x 1.25" (Standard)</MenuItem>
                <MenuItem value="3x1">3" x 1" (Large)</MenuItem>
                <MenuItem value="4x2">4" x 2" (Extra Large)</MenuItem>
                <MenuItem value="1.5x1">1.5" x 1" (Small)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={templateForm.description}
              onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              placeholder="Describe this template"
            />
            <FormControl fullWidth>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={templateForm.fontSize}
                onChange={(e) => setTemplateForm({ ...templateForm, fontSize: e.target.value })}
                label="Font Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={templateForm.orientation}
                onChange={(e) => setTemplateForm({ ...templateForm, orientation: e.target.value })}
                label="Orientation"
              >
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Include Fields</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1 }}>
                {[
                  { value: 'name', label: 'Product Name' },
                  { value: 'price', label: 'Price' },
                  { value: 'barcode', label: 'Barcode' },
                  { value: 'sku', label: 'SKU' },
                  { value: 'category', label: 'Category' },
                  { value: 'brand', label: 'Brand' }
                ].map((field) => (
                  <FormControlLabel
                    key={field.value}
                    control={
                      <Checkbox
                        checked={templateForm.fields.includes(field.value)}
                        onChange={(e) => handleFieldChange(field.value, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateTemplate(false)}>Cancel</Button>
          <Button onClick={handleCreateTemplate} variant="contained">Save Template</Button>
        </DialogActions>
      </Dialog>

      {/* Generate Labels Modal */}
      <Dialog open={showGenerateLabels} onClose={() => setShowGenerateLabels(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Generate Product Labels</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Template</InputLabel>
              <Select
                value={generateForm.templateId}
                onChange={(e) => setGenerateForm({ ...generateForm, templateId: e.target.value })}
                label="Select Template"
                required
              >
                <MenuItem value="">Choose a template</MenuItem>
                {templates.map(template => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name} - {getSizeLabel(template.size)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Labels per Product"
              type="number"
              value={generateForm.quantityPerProduct}
              onChange={(e) => setGenerateForm({ ...generateForm, quantityPerProduct: parseInt(e.target.value) })}
              inputProps={{ min: 1, max: 10 }}
            />
            <FormControl fullWidth>
              <InputLabel>Output Format</InputLabel>
              <Select
                value={generateForm.format}
                onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                label="Output Format"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="png">PNG Images</MenuItem>
                <MenuItem value="jpg">JPG Images</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateForm.includeBarcode}
                    onChange={(e) => setGenerateForm({ ...generateForm, includeBarcode: e.target.checked })}
                  />
                }
                label="Include barcode on labels"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Select Products</Typography>
              <Box sx={{ border: '1px solid #e9ecef', borderRadius: 1, p: 2, maxHeight: 200, overflowY: 'auto' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={generateForm.products.length === 3} // Mock: assuming 3 products
                      onChange={(e) => handleSelectAllProducts(e.target.checked)}
                    />
                  }
                  label={<strong>Select All Products</strong>}
                  sx={{ mb: 1 }}
                />
                {[
                  { id: '1', name: 'Sample Product 1', stock: 50 },
                  { id: '2', name: 'Sample Product 2', stock: 30 },
                  { id: '3', name: 'Sample Product 3', stock: 100 }
                ].map((product) => (
                  <FormControlLabel
                    key={product.id}
                    control={
                      <Checkbox
                        checked={generateForm.products.includes(product.id)}
                        onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                      />
                    }
                    label={`${product.name} (Stock: ${product.stock})`}
                    sx={{ display: 'block', ml: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateLabels(false)}>Cancel</Button>
          <Button onClick={handleGenerateLabels} variant="contained">Generate Labels</Button>
        </DialogActions>
      </Dialog>

      {/* Label Preview Modal */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Label Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {selectedTemplate && (
              <Box
                sx={{
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: 1,
                  p: 2,
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Product Name
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  $99.99
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '10px' }}>
                  BARCODE123
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Template: {selectedTemplate?.name} | Size: {getSizeLabel(selectedTemplate?.size || '')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Labels;