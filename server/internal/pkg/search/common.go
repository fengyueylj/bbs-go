package search

import (
	"log/slog"

	"github.com/blevesearch/bleve/v2"
	"github.com/blevesearch/bleve/v2/mapping"
	"github.com/mlogclub/simple/common/jsons"
)

type TopicDocument struct {
	Id         int64    `json:"id"`
	NodeId     int64    `json:"nodeId"`
	UserId     int64    `json:"userId"`
	Nickname   string   `json:"nickname"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Tags       []string `json:"tags"`
	Recommend  bool     `json:"recommend"`
	Status     int      `json:"status"`
	CreateTime int64    `json:"createTime"`
	// 地理位置字段
	District   string `json:"district"`
	Detail     string `json:"detail"`
	RoomNumber string `json:"roomNumber"`
}

func (t *TopicDocument) ToStr() string {
	str, err := jsons.ToStr(t)
	if err != nil {
		slog.Error(err.Error(), slog.Any("err", err))
	}
	return str
}

func newIndex(indexPath string) bleve.Index {
	mapping := bleve.NewIndexMapping()
	mapping.DefaultMapping.AddFieldMappingsAt("id", newNumField())
	mapping.DefaultMapping.AddFieldMappingsAt("nodeId", newNumField())
	mapping.DefaultMapping.AddFieldMappingsAt("userId", newNumField())
	mapping.DefaultMapping.AddFieldMappingsAt("nickname", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("title", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("content", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("tags", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("recommend", newBoolField())
	mapping.DefaultMapping.AddFieldMappingsAt("status", newNumField())
	mapping.DefaultMapping.AddFieldMappingsAt("createTime", newNumField())
	// 地理位置字段映射
	mapping.DefaultMapping.AddFieldMappingsAt("district", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("detail", newTextField())
	mapping.DefaultMapping.AddFieldMappingsAt("roomNumber", newTextField())

	index, err := bleve.New(indexPath, mapping)
	if err != nil {
		slog.Info("创建索引失败", slog.Any("err", err))
	}
	return index
}

func newTextField() *mapping.FieldMapping {
	/*
		textField := bleve.NewTextFieldMapping()
		// textField.Store = true
		textField.Index = true
		textField.IncludeTermVectors = true
		textField.Analyzer = "en"
		return textField
	*/
	fm := bleve.NewTextFieldMapping()
	fm.Analyzer = "cjk"
	return fm
}

func newNumField() *mapping.FieldMapping {
	/*
		numField := bleve.NewNumericFieldMapping()
		// numField.Store = true
		numField.Index = true
		numField.DocValues = true
		return numField
	*/
	return bleve.NewNumericFieldMapping()
}

func newBoolField() *mapping.FieldMapping {
	/*
		boolField := bleve.NewBooleanFieldMapping()
		// boolField.Store = true
		boolField.Index = true
		boolField.DocValues = true
		return boolField
	*/
	return bleve.NewBooleanFieldMapping()
}
